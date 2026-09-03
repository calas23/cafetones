"use client";

import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { Icon } from "@/components/Icon";
import { PhoneText } from "@/components/PhoneText";
import { telHref } from "@/lib/phone";
import type { SbBlok } from "@/lib/types";

// Formulaires — portage 1:1 de js/form.js : validation au blur, messages
// d'erreur, push GTM dataLayer à la soumission, écran de succès.
// Comme sur l'ancien site, aucune donnée n'est envoyée à un serveur.

type Errors = Record<string, string | null>;

function validateValue(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string | null {
  const value = el.value.trim();
  if (el.hasAttribute("required") && value === "") return "Ce champ est requis";
  const type = (el as HTMLInputElement).type;
  if (type === "email" && value !== "") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Veuillez entrer une adresse email valide";
  }
  if (type === "tel" && value !== "") {
    const cleaned = value.replace(/[\s\-.()]/g, "");
    if (cleaned.length < 10) return "Veuillez entrer un numéro de téléphone valide";
  }
  return null;
}

function useSiteForm(formName: string) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean => {
    const err = validateValue(el);
    setErrors((prev) => ({ ...prev, [el.name]: err }));
    return !err;
  };

  const handlers = {
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      validateField(e.currentTarget),
    onInput: (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      setErrors((prev) => (prev[el.name] ? { ...prev, [el.name]: validateValue(el) } : prev));
    },
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    let isValid = true;
    form.querySelectorAll<HTMLInputElement>("[required]").forEach((field) => {
      if (!validateField(field)) isValid = false;
    });
    if (!isValid) return;

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "form_submission",
      form_name: formName,
      form_data: { entreprise: data.entreprise || "", effectif: data.effectif || "" },
    });
    setSubmitted(true);
    console.log("Form submitted:", data);
  };

  return { errors, submitted, handlers, onSubmit };
}

type Handlers = ReturnType<typeof useSiteForm>["handlers"];

function fieldStyle(error?: string | null): CSSProperties | undefined {
  return error ? { borderColor: "var(--color-error)" } : undefined;
}

function ErrorSpan({ error }: { error?: string | null }) {
  return (
    <span className="form-error" style={error ? { display: "block" } : undefined}>
      {error || ""}
    </span>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label className="form-label" htmlFor={htmlFor}>
      {children}
      {optional ? (
        <>
          {" "}
          <span className="text-light">(optionnel)</span>
        </>
      ) : null}
    </label>
  );
}

function TextField(props: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  errors: Errors;
  handlers: Handlers;
}) {
  const { id, name, label, placeholder, type = "text", required, optional, errors, handlers } = props;
  const error = errors[name];
  return (
    <div className="form-group">
      <Label htmlFor={id} optional={optional}>{label}</Label>
      <input
        type={type}
        id={id}
        name={name}
        className={error ? "form-input error" : "form-input"}
        placeholder={placeholder}
        required={required || undefined}
        style={fieldStyle(error)}
        {...handlers}
      />
      {required ? <ErrorSpan error={error} /> : null}
    </div>
  );
}

function TextArea(props: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  optional?: boolean;
  minHeight?: string;
  errors: Errors;
  handlers: Handlers;
}) {
  const { id, name, label, placeholder, required, optional, minHeight, errors, handlers } = props;
  const error = errors[name];
  const style: CSSProperties = { ...(minHeight ? { minHeight } : {}), ...(fieldStyle(error) || {}) };
  return (
    <div className="form-group">
      <Label htmlFor={id} optional={optional}>{label}</Label>
      <textarea
        id={id}
        name={name}
        className={error ? "form-textarea error" : "form-textarea"}
        placeholder={placeholder}
        required={required || undefined}
        style={Object.keys(style).length ? style : undefined}
        {...handlers}
      />
      {required ? <ErrorSpan error={error} /> : null}
    </div>
  );
}

function SelectField(props: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: [string, string][];
  required?: boolean;
  optional?: boolean;
  errors: Errors;
  handlers: Handlers;
}) {
  const { id, name, label, placeholder, options, required, optional, errors, handlers } = props;
  const error = errors[name];
  return (
    <div className="form-group">
      <Label htmlFor={id} optional={optional}>{label}</Label>
      <select
        id={id}
        name={name}
        className={error ? "form-select error" : "form-select"}
        required={required || undefined}
        defaultValue=""
        style={fieldStyle(error)}
        {...handlers}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(([value, text]) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
      {required ? <ErrorSpan error={error} /> : null}
    </div>
  );
}

function SubmitButton({ label, size = "lg" }: { label?: string; size?: "lg" | "" }) {
  const cls = size === "lg" ? "btn btn--primary btn--lg btn--full" : "btn btn--primary btn--full";
  return (
    <button type="submit" className={cls}>
      {label}{" "}
      <Icon name="arrow-right" size={18} stroke={2} />
    </button>
  );
}

function FormSuccess({ active, title, text }: { active: boolean; title?: string; text?: string }) {
  return (
    <div className={active ? "form-success active" : "form-success"}>
      <div className="form-success__icon">
        <Icon name="check" size={32} stroke={2} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* ---------------- Section formulaire CTA (accueil, bureau, CHR) ---------------- */

export type QuoteFormBlok = SbBlok & {
  style_variant?: string; // cream_home | plain | cream_chr
  anchor_id?: string;
  form_name?: string;
  variant?: string; // contact_rapide | degustation_bureau | degustation_chr
  title?: string;
  subtitle?: string;
  phone_label?: string;
  phone?: string;
  phone_location?: string;
  phone_hours?: string;
  separator?: string;
  submit_label?: string;
  note?: string;
  success_title?: string;
  success_text?: string;
};

const SECTION_CLASSES: Record<string, string> = {
  cream_home: "section section--cream cta-section",
  plain: "section cta-section",
  cream_chr: "section cta-section section--cream",
};

export function QuoteFormSection({ blok }: { blok: QuoteFormBlok }) {
  const formName = blok.form_name || "contact";
  const { errors, submitted, handlers, onSubmit } = useSiteForm(formName);
  const phone = blok.phone || "06 62 11 97 48";
  const variant = blok.variant || "contact_rapide";

  return (
    <section
      className={SECTION_CLASSES[blok.style_variant || "cream_home"] || SECTION_CLASSES.cream_home}
      id={blok.anchor_id || undefined}
      {...storyblokEditable(blok)}
    >
      <div className="container">
        <form className="cta-form animate-on-scroll" data-form={formName} noValidate onSubmit={onSubmit}>
          <div className="form-content" style={submitted ? { display: "none" } : undefined}>
            <h2 className="cta-form__title">{blok.title}</h2>
            <p className="cta-form__subtitle">{blok.subtitle}</p>

            <div className="phone-cta-block">
              <div className="phone-cta-block__label">{blok.phone_label}</div>
              <a href={telHref(phone)} className="phone-cta-block__number" data-location={blok.phone_location || undefined}>
                <PhoneText phone={phone} large />
              </a>
              <div className="phone-cta-block__hours">{blok.phone_hours}</div>
            </div>
            <p className="form-separator">{blok.separator}</p>

            {variant === "contact_rapide" ? (
              <>
                <div className="form-row">
                  <TextField id="nom" name="nom" label="Nom" placeholder="Votre nom" required errors={errors} handlers={handlers} />
                  <TextField id="entreprise" name="entreprise" label="Entreprise" placeholder="Nom de votre entreprise" errors={errors} handlers={handlers} />
                </div>
                <div className="form-row">
                  <TextField id="email" name="email" type="email" label="Email" placeholder="vous@entreprise.fr" required errors={errors} handlers={handlers} />
                  <TextField id="telephone" name="telephone" type="tel" label="Téléphone" placeholder="01 23 45 67 89" required errors={errors} handlers={handlers} />
                </div>
                <TextArea id="message" name="message" label="Message" optional placeholder="Comment pouvons-nous vous aider ?" errors={errors} handlers={handlers} />
              </>
            ) : null}

            {variant === "degustation_bureau" ? (
              <>
                <div className="form-row">
                  <TextField id="prenom" name="prenom" label="Prénom" placeholder="Votre prénom" required errors={errors} handlers={handlers} />
                  <TextField id="nom" name="nom" label="Nom" placeholder="Votre nom" required errors={errors} handlers={handlers} />
                </div>
                <TextField id="entreprise" name="entreprise" label="Entreprise" placeholder="Nom de votre entreprise" required errors={errors} handlers={handlers} />
                <div className="form-row">
                  <TextField id="email" name="email" type="email" label="Email professionnel" placeholder="vous@entreprise.fr" required errors={errors} handlers={handlers} />
                  <TextField id="telephone" name="telephone" type="tel" label="Téléphone" placeholder="01 23 45 67 89" required errors={errors} handlers={handlers} />
                </div>
                <SelectField
                  id="effectif"
                  name="effectif"
                  label="Effectif de votre entreprise"
                  placeholder="Sélectionnez"
                  required
                  options={[
                    ["1-10", "1 à 10 personnes"],
                    ["11-30", "11 à 30 personnes"],
                    ["31-50", "31 à 50 personnes"],
                    ["51-100", "51 à 100 personnes"],
                    ["100+", "Plus de 100 personnes"],
                  ]}
                  errors={errors}
                  handlers={handlers}
                />
                <TextArea id="message" name="message" label="Message" optional placeholder="Précisez vos besoins : type de café, machine existante, fréquence souhaitée…" errors={errors} handlers={handlers} />
              </>
            ) : null}

            {variant === "degustation_chr" ? (
              <>
                <div className="form-row">
                  <TextField id="prenom" name="prenom" label="Prénom" placeholder="Votre prénom" required errors={errors} handlers={handlers} />
                  <TextField id="nom" name="nom" label="Nom" placeholder="Votre nom" required errors={errors} handlers={handlers} />
                </div>
                <TextField id="etablissement" name="entreprise" label="Établissement" placeholder="Nom de votre établissement" required errors={errors} handlers={handlers} />
                <div className="form-row">
                  <TextField id="email" name="email" type="email" label="Email" placeholder="vous@restaurant.fr" required errors={errors} handlers={handlers} />
                  <TextField id="telephone" name="telephone" type="tel" label="Téléphone" placeholder="01 23 45 67 89" required errors={errors} handlers={handlers} />
                </div>
                <div className="form-row">
                  <SelectField
                    id="type-etablissement"
                    name="type-etablissement"
                    label="Type d'établissement"
                    placeholder="Sélectionnez"
                    required
                    options={[
                      ["restaurant", "Restaurant"],
                      ["bar-cafe", "Bar / Café"],
                      ["hotel", "Hôtel"],
                      ["brasserie", "Brasserie"],
                      ["traiteur", "Traiteur"],
                      ["autre", "Autre"],
                    ]}
                    errors={errors}
                    handlers={handlers}
                  />
                  <SelectField
                    id="couverts"
                    name="couverts"
                    label="Couverts / jour"
                    optional
                    placeholder="Nombre de couverts/jour"
                    options={[
                      ["moins-50", "Moins de 50"],
                      ["50-100", "50 à 100"],
                      ["100-200", "100 à 200"],
                      ["plus-200", "Plus de 200"],
                    ]}
                    errors={errors}
                    handlers={handlers}
                  />
                </div>
                <TextArea id="message" name="message" label="Message" optional placeholder="Précisez vos besoins : type de café, machine existante, volume quotidien…" errors={errors} handlers={handlers} />
              </>
            ) : null}

            <SubmitButton label={blok.submit_label} />

            <p className="form-note text-center" style={{ marginTop: "1rem" }}>{blok.note}</p>
          </div>

          <FormSuccess active={submitted} title={blok.success_title} text={blok.success_text} />
        </form>
      </div>
    </section>
  );
}

/* ---------------- Particuliers : bloc contact/commande ---------------- */

export type PartContactBlok = SbBlok & {
  anchor_id?: string;
  title?: string;
  subtitle?: string;
  phone_title?: string;
  phone?: string;
  phone_location?: string;
  hours_text?: string;
  advice_text?: string;
  email?: string;
  submit_label?: string;
  note?: string;
  success_title?: string;
  success_text?: string;
};

export function PartContactSection({ blok }: { blok: PartContactBlok }) {
  const { errors, submitted, handlers, onSubmit } = useSiteForm("contact-particuliers");
  const phone = blok.phone || "06 62 11 97 48";

  return (
    <section className="section" id={blok.anchor_id || undefined} {...storyblokEditable(blok)}>
      <div className="container">
        <div className="text-center animate-on-scroll">
          <h2>{blok.title}</h2>
          <p className="text-muted" style={{ maxWidth: "540px", margin: "1rem auto 0" }}>{blok.subtitle}</p>
        </div>

        <div className="part-contact">
          <div className="part-contact__phone animate-on-scroll">
            <h3>
              <Icon
                name="phone"
                size={22}
                stroke={2}
                strokeColor="var(--color-crema-dark)"
                style={{ verticalAlign: "-4px", marginRight: "0.5rem" }}
              />{" "}
              {blok.phone_title}
            </h3>
            <a href={telHref(phone)} className="part-contact__phone-number" data-location={blok.phone_location || undefined}>
              <PhoneText phone={phone} large />
            </a>
            <p>{blok.hours_text}</p>
            <p>{blok.advice_text}</p>
            <div className="part-contact__email">
              Ou par email : <a href={`mailto:${blok.email || ""}`}>{blok.email}</a>
            </div>
          </div>

          <div className="animate-on-scroll delay-1">
            <form data-form="contact-particuliers" noValidate onSubmit={onSubmit}>
              <div className="form-content" style={submitted ? { display: "none" } : undefined}>
                <TextField id="nom" name="nom" label="Nom" placeholder="Votre nom" required errors={errors} handlers={handlers} />
                <div className="form-row">
                  <TextField id="email" name="email" type="email" label="Email" placeholder="votre@email.fr" errors={errors} handlers={handlers} />
                  <TextField id="telephone" name="telephone" type="tel" label="Téléphone" placeholder="06 12 34 56 78" required errors={errors} handlers={handlers} />
                </div>
                <TextArea id="message" name="message" label="Message" required placeholder="Dites-nous ce qui vous ferait plaisir : quels cafés, quelle quantité, pour quelle machine…" errors={errors} handlers={handlers} />

                <SubmitButton label={blok.submit_label} size="" />

                <p className="form-note text-center" style={{ marginTop: "1rem" }}>{blok.note}</p>
              </div>

              <FormSuccess active={submitted} title={blok.success_title} text={blok.success_text} />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
