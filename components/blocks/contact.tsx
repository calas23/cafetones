"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { Icon } from "@/components/Icon";
import { Illustration } from "@/components/Illustration";
import { PhoneText } from "@/components/PhoneText";
import { telHref } from "@/lib/phone";
import { fmt, fmtTel } from "@/lib/text";
import type { SbBlok } from "@/lib/types";

// Page contact : formulaire + colonne d'informations, et FAQ accordéon
// (port du script inline de l'ancienne page contact).

type Errors = Record<string, string | null>;

function validateValue(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string | null {
  const value = el.value.trim();
  if (el.hasAttribute("required") && value === "") return "Ce champ est requis";
  const type = (el as HTMLInputElement).type;
  if (type === "email" && value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Veuillez entrer une adresse email valide";
  if (type === "tel" && value !== "" && value.replace(/[\s\-.()]/g, "").length < 10)
    return "Veuillez entrer un numéro de téléphone valide";
  return null;
}

export type ContactSectionBlok = SbBlok & {
  form_title?: string;
  form_intro?: string;
  submit_label?: string;
  note?: string;
  success_title?: string;
  success_text?: string;
  info_title?: string;
  address?: string;
  phone?: string;
  phone_location?: string;
  email?: string;
  hours?: string;
  zone_title?: string;
  zone_text?: string;
  degust_title?: string;
  degust_text?: string;
  degust_button_label?: string;
  degust_button_link?: string;
  map_heading?: string;
  map_url?: string;
  map_title?: string;
};

export function ContactSection({ blok }: { blok: ContactSectionBlok }) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const phone = blok.phone || "06 62 11 97 48";

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
      form_name: "contact-page",
      form_data: { entreprise: data.entreprise || "", effectif: data.effectif || "" },
    });
    setSubmitted(true);
    console.log("Form submitted:", data);
  };

  const err = (name: string) => errors[name];
  const inputCls = (name: string, base: string) => (err(name) ? `${base} error` : base);
  const inputStyle = (name: string): CSSProperties | undefined =>
    err(name) ? { borderColor: "var(--color-error)" } : undefined;
  const errorSpan = (name: string) => (
    <span className="form-error" style={err(name) ? { display: "block" } : undefined}>
      {err(name) || ""}
    </span>
  );

  return (
    <section className="section" {...storyblokEditable(blok)}>
      <div className="container">
        <div className="contact-layout">
          <div className="contact-form-card animate-on-scroll">
            <h2>{blok.form_title}</h2>
            <p>{fmt(blok.form_intro)}</p>

            <form data-form="contact-page" noValidate onSubmit={onSubmit}>
              <div className="form-content" style={submitted ? { display: "none" } : undefined}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="prenom">Prénom</label>
                    <input type="text" id="prenom" name="prenom" className={inputCls("prenom", "form-input")} placeholder="Votre prénom" required style={inputStyle("prenom")} {...handlers} />
                    {errorSpan("prenom")}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="nom">Nom</label>
                    <input type="text" id="nom" name="nom" className={inputCls("nom", "form-input")} placeholder="Votre nom" required style={inputStyle("nom")} {...handlers} />
                    {errorSpan("nom")}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="entreprise">
                    Entreprise <span className="text-light">(optionnel)</span>
                  </label>
                  <input type="text" id="entreprise" name="entreprise" className="form-input" placeholder="Nom de votre entreprise" {...handlers} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" className={inputCls("email", "form-input")} placeholder="vous@entreprise.fr" required style={inputStyle("email")} {...handlers} />
                    {errorSpan("email")}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="telephone">Téléphone</label>
                    <input type="tel" id="telephone" name="telephone" className={inputCls("telephone", "form-input")} placeholder="01 23 45 67 89" required style={inputStyle("telephone")} {...handlers} />
                    {errorSpan("telephone")}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="sujet">Sujet</label>
                  <select id="sujet" name="sujet" className={inputCls("sujet", "form-select")} required defaultValue="" style={inputStyle("sujet")} {...handlers}>
                    <option value="" disabled>Quel est l&apos;objet de votre demande ?</option>
                    <option value="degustation">Demande de dégustation gratuite</option>
                    <option value="devis">Demande de devis</option>
                    <option value="info-produits">Information sur les produits</option>
                    <option value="info-machines">Information sur les machines</option>
                    <option value="devenir-client">Devenir client</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errorSpan("sujet")}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="effectif">
                    Effectif <span className="text-light">(optionnel)</span>
                  </label>
                  <select id="effectif" name="effectif" className="form-select" defaultValue="" {...handlers}>
                    <option value="" disabled>Nombre de collaborateurs (optionnel)</option>
                    <option value="1-10">1 à 10 personnes</option>
                    <option value="11-30">11 à 30 personnes</option>
                    <option value="31-50">31 à 50 personnes</option>
                    <option value="51-100">51 à 100 personnes</option>
                    <option value="100+">Plus de 100 personnes</option>
                    <option value="chr">Je suis restaurateur / CHR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className={inputCls("message", "form-textarea")}
                    placeholder="Décrivez votre besoin : type de café souhaité, nombre de tasses par jour, machine existante, fréquence de livraison…"
                    required
                    style={{ minHeight: "140px", ...(inputStyle("message") || {}) }}
                    {...handlers}
                  />
                  {errorSpan("message")}
                </div>

                <button type="submit" className="btn btn--primary btn--lg btn--full">
                  {blok.submit_label}{" "}
                  <Icon name="arrow-right" size={18} stroke={2} />
                </button>

                <p className="form-note text-center" style={{ marginTop: "1rem" }}>{blok.note}</p>
              </div>

              <div className={submitted ? "form-success active" : "form-success"}>
                <div className="form-success__icon">
                  <Icon name="check" size={32} stroke={2} />
                </div>
                <h3>{blok.success_title}</h3>
                <p>{blok.success_text}</p>
              </div>
            </form>
          </div>

          <div className="contact-info animate-on-scroll delay-1">
            <h3>{blok.info_title}</h3>
            <div className="contact-info-line">
              <Icon name="map-pin" size={18} stroke={1.8} />
              {blok.address}
            </div>
            <div className="contact-info-line">
              <Icon name="phone" size={18} stroke={1.8} />
              <a href={telHref(phone)} data-location={blok.phone_location || undefined}><PhoneText phone={phone} /></a>
            </div>
            <div className="contact-info-line">
              <Icon name="mail" size={18} stroke={1.8} />
              {blok.email}
            </div>
            <div className="contact-info-line">
              <Icon name="clock" size={18} stroke={1.8} />
              {blok.hours}
            </div>

            <h3>{blok.zone_title}</h3>
            <p>{fmt(blok.zone_text)}</p>

            <h3>{blok.degust_title}</h3>
            <p>{fmt(blok.degust_text)}</p>
            <a href={blok.degust_button_link || "#"} className="btn btn--primary" style={{ marginTop: "0.75rem" }}>
              {blok.degust_button_label}
            </a>

            <h3>{blok.map_heading}</h3>
            {blok.map_url ? (
              <iframe
                className="contact-map"
                src={blok.map_url}
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={blok.map_title || "Localisation"}
              ></iframe>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ accordéon ---------------- */

type FaqItem = SbBlok & { question?: string; answer?: string; delay?: string };
export type FaqBlok = SbBlok & {
  title?: string;
  items?: FaqItem[];
  illustration?: string;
  illustration_position?: string;
  illustration_size?: string;
};

export function FaqSection({ blok }: { blok: FaqBlok }) {
  const [open, setOpen] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      el.style.maxHeight = i === open ? el.scrollHeight + "px" : "0";
    });
  }, [open]);

  return (
    <section className="section section--cream" {...storyblokEditable(blok)}>
      <div className="container">
        <div
          className="text-center animate-on-scroll"
          data-illustration={blok.illustration || undefined}
          data-illustration-position={blok.illustration_position || undefined}
          data-illustration-size={blok.illustration_size || undefined}
          style={{ position: "relative" }}
        >
          <h2>{fmt(blok.title)}</h2>
          <Illustration {...blok} />
        </div>

        <div className="faq">
          {(blok.items ?? []).map((item, i) => {
            const delayCls = item.delay ? ` delay-${item.delay}` : "";
            return (
              <div
                className={`faq-item animate-on-scroll${delayCls}${open === i ? " active" : ""}`}
                key={item._uid}
                {...storyblokEditable(item)}
              >
                <button className="faq-question" type="button" onClick={() => setOpen(open === i ? null : i)}>
                  {item.question}
                  <Icon name="chevron-down" size={20} stroke={2} />
                </button>
                <div
                  className="faq-answer"
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                >
                  <div className="faq-answer__inner">{fmtTel(item.answer)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
