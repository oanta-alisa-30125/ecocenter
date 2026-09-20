# ECOCENTER SERV SRL — site de prezentare

Site de prezentare cu galerie foto administrabilă și zonă privată de încărcare.

## Ce conține

- pagină publică modernă, responsive;
- secțiuni: Acasă, Despre noi, Servicii, Lucrări, Contact;
- logo-ul actual inclus;
- galerie foto dinamică;
- `/admin.html` pentru administrarea fotografiilor;
- autentificare prin parolă;
- încărcare JPG/PNG/WEBP, max. 10 MB/imagine;
- ștergere fotografii din panoul de administrare.

## Rulare pe calculator

Ai nevoie de Node.js.

1. Deschide terminalul în folder.
2. Rulează:
   `npm install`
3. Copiază `.env.example` în `.env`.
4. În `.env`, schimbă `ADMIN_PASSWORD` cu parola ta.
5. Rulează:
   `npm start`
6. Deschide `http://localhost:3000`.
7. Administrarea galeriei este la `http://localhost:3000/admin.html`.

## Important pentru publicare

Pentru ca fotografiile să rămână salvate online, site-ul trebuie găzduit pe un serviciu care păstrează fișierele de pe server sau pe un storage extern. Înainte de publicare trebuie să configurăm și HTTPS, o parolă puternică și `secure: true` pentru cookie.

## Date care mai trebuie completate

- telefon;
- email;
- adresă exactă;
- program;
- lista finală a serviciilor;
- autorizații/certificări, dacă există;
- fotografiile proiectelor.
