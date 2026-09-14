// Client minimal de la Management API Storyblok, partagé par les scripts d'opérations
// de contenu (scripts/storyblok/ops/*). Même logique que bootstrap.mjs : détection de la
// région du space, nouvelle tentative sur 429, pause entre les appels (limite de débit).

const HOSTS = [
  "https://mapi.storyblok.com",
  "https://api-us.storyblok.com",
  "https://mapi-ap.storyblok.com",
  "https://mapi-ca.storyblok.com",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function createClient({ pat = process.env.STORYBLOK_PAT, spaceId = process.env.STORYBLOK_SPACE_ID } = {}) {
  if (!pat || !spaceId) throw new Error("STORYBLOK_PAT et STORYBLOK_SPACE_ID sont requis.");
  let host = HOSTS[0];

  async function api(method, path, body) {
    const url = `${host}/v1/spaces/${spaceId}${path}`;
    for (let attempt = 0; attempt < 4; attempt++) {
      const res = await fetch(url, {
        method,
        headers: { Authorization: pat, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.status === 429) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      if (!res.ok) {
        const text = await res.text();
        const err = new Error(`${method} ${path} → ${res.status} ${text.slice(0, 300)}`);
        err.status = res.status;
        throw err;
      }
      await sleep(300);
      if (res.status === 204) return null;
      return res.json();
    }
    throw new Error(`${method} ${path} → 429 répété (rate limit)`);
  }

  async function detectHost() {
    for (const h of HOSTS) {
      host = h;
      try {
        const data = await api("GET", "");
        console.log(`✓ Space "${data.space?.name}" atteint via ${h}`);
        return;
      } catch (e) {
        if (e.status === 401) throw new Error("401 : STORYBLOK_PAT invalide ou sans accès à ce space.");
      }
    }
    throw new Error(`Space ${spaceId} introuvable sur ${HOSTS.join(", ")}.`);
  }

  async function findStory(fullSlug) {
    const res = await api("GET", `/stories?with_slug=${encodeURIComponent(fullSlug)}`);
    return (res.stories || [])[0] || null;
  }

  // Story complète (contenu = brouillon courant, modifications non publiées comprises).
  async function getStory(id) {
    const res = await api("GET", `/stories/${id}`);
    return res.story;
  }

  async function saveStory(id, content, { publish = false } = {}) {
    const payload = { story: { content } };
    if (publish) payload.publish = 1;
    return api("PUT", `/stories/${id}`, payload);
  }

  return { api, detectHost, findStory, getStory, saveStory };
}
