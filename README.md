# DC2 — DE CONNECTORS

Website van DE CONNECTORS (Celebrating People), klaar voor Netlify.

## Netlify

Nieuwe site → import deze repository. Node 22 en de publiceermap `dist` staan in `netlify.toml`.

Zet bij Environment variables de sleutel `DATABASE_URL` op het Postgres-adres van Supabase. Zonder die sleutel blijft de site online met de teksten die er nu in zitten. Nieuwe wijzigingen in het admin-scherm (`/admin`) zijn dan alleen zichtbaar in de browser van degene die bewerkt.
