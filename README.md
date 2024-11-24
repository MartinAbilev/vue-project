# Projekts: Reālā laika datu vizualizācijas rīks

Izmantojot Node.js, Vue.js un WebSocket, ir nepieciešams izstrādāt rīku reālā laika datu ģenerēšanai un vizualizēšanai. Rīks sastāv no divām daļām - Node.js servera daļas un Vue.js saskarnes, kuru savstarpējā datu komunikācija notiek, izmantojot WebSocket protokolu.

## Pamata uzdevums

### Node.js serveris - Izpildīts

   Izveidot Node.js serveri, kas katras 10 sekundes ģenerē nejaušu skaitli.
   - Skaitlis nedrīkst būt mazāks par 0 un lielāks par 100.
   - Skaitlim jābūt robežās ±30% no iepriekš ģenerētā skaitļa (ja tāds eksistē).
   - Pēc skaitļa ģenerēšanas, tā vērtību un ģenerēšanas laiku ir nepieciešams publiskot WebSocket ziņojumos uz saskarni.

### Vue.js saskarne - Izpildīts


   Vue.js saskarne saņem datus no WebSocket savienojuma.
   - Saņemtais skaitlis kopā ar tā ģenerēšanas datumu un laiku (timestamp) tiek saglabāts kā datu punkts.
   - Datu punktus ir nepieciešams reaktīvi atrādīt līniju tipa grafikā.

   Līniju grafiks:
   - X-ass attēlot datuma un laika vērtības (timestamp).
   - Y-ass attēlot saņemto skaitli.
   - Katru reizi, kad tiek saņemts jauns skaitlis, grafiks tiek reaktīvi atjaunots.
   - Grafikā nevar būt vairāk par 15 datu punkiem.


## 1. Papilduzdevums - Robežu % maiņas mehānisms. - Izpildīts


Ir nepieciešams rīka saskarnē lietotājam atrādīt tagadējo un sniegt iespēju mainīt robežu % vērtību uz servera. Mainoties uz servera % vērtībai, tā jaunajai vērtībai jābūt redzamai visiem aplikācijas lietotājiem reaktīvi.

### Node.js serveris - Izpildīts
- Pārveidot ģenerētā skaitļa robežu % par mainīgu vērtību (pēc noklusējuma ±30%).
- Izstrādāt webservisu, ar kuru palīdzību ir iespējams mainīt šo vērtību.
- Izstrādāt WebSocket atpakaļsaiti saskarnēm, kas sūta ziņojumu saskarnei par % vērtības maiņu.

### Vue.js saskarne - Izpildīts
- Pievienot teksta saturošu elementu, kurš attēlotu faktisko %, kas ir iestatīts tagad uz servera.
- Pievienot ievades laiku, kurā var norādīt jauno % vērtību.
- Pievienot pogu "saglabāt", pēc kuras nospiešanas jaunā % vērtība tiek nosūtīta un atjaunota uz servera.

## 2. Papilduzdevums - Autentifikācijas mehānisms. - Izpildīts

Ir nepieciešams izstrādāt primitīvu autentifikācijas mehānismu saskarnes saziņai ar serveri. Uzdevums mērķis ir izstrādāt tikai verificēšanas mehānismu, nevis izstrādātu pilnu implementāciju ar datubāzi, tāpēc *username/password* var tiks iešūts kodā *admin/admin*.

### Node.js serveris. - Izpildīts
- Izstrādāt servisu lietotāja kredenciāļu pārbaudei, kur veiksmīgas izpildes rezultātā lietotājam tiek piešķirta sesija (JWT).
- Izstrādāt autentificētās daļas sesijas verifikācijas mehānismu visām integrācijām (REST/WebSocket) ar saskarni.

### Vue.js saskarne. - Izpildīts
- Izstrādāt jaunu saskarnes skatu priekš autentifikācijas.
- Izstrādāt mehānismu, kā nodrošināt piekļūstamību saskarnes saturam un servera datiem tikai autorizētajiem lietotājiem.

## 3. Papilduzdevums - Datu atjaunošans mehānisms. - Izpildīts

Ir nepieciešams izstrādāt mehānismu, kurš saglabā pēdējos 15 ģenerētos data punktus servera pusē. Gadījumos, kad serveris tiks apstādināts un/vai restartēts, iepriekšējie ģenerētie datu punkti netiks nozaudēti. Uzdevuma mērķis ir izstrādāt datu glabāšanas un atjaunošanas mehānismu, nevis izstrādāt pilnu implementāciju ar datubāzi. Datu punktus ir nepieciešams glabāt failā uz servera (var izmantot sqlite). Servera darbības atjaunošanas gadījumā ir nepieciešams atjaunot vēsturiskos datu punktus no faila.

Ir nepieciešams izstrādāt mehānismu, kurš saskarnei nodrošinātu pirmreizējo datu ielādi par pēdējiem 15 datu punktiem (ja tādi ir).

### Node.js serveris. - Izpildīts
- izstrādāt procesu, kurš izveido datu punktu saturošu failu, ja tāda nav.
- Izstrādāt procesu, kurš ielasa pēdējo data punktu pēc servera darbības atjaunošanas.
- Izstrādāt procesu, kurš papildina failu ar jauni ģenerēto datu punktu.
- Izstrādāt webservisu vēsturisko datu punktu ielādei lietotāju saskarnē.

### Vue.js saskarne. - Izpildīts
- Uzlabot grafiku, lai tajā rādītos arī vēsturiski ģenerētie datu punkti.
- Pievienot teksta elementu vietnē, kad pēdējo reizi tika atjaunoti dati.
- Pievienot teksta elementu, kura būtu pazīme, vai vietne uztur aktīvu WebSocket pieslēgumu ar serveri (connected/disconnected).
- Veikt automātisku atkātotu pieslēgšanos serverim pēc tā darbības atjaunošanas.


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Server startup
```sh
node server.js
```
