/* Site configuration read by the form handler (src/scripts/site.js).
   ------------------------------------------------------------------
   FORMS. Every form on the site posts to one Formspree form, which relays
   each submission by email to the recipient configured in Formspree.
   The site name, form name and page go in the email subject so the team
   can tell submissions apart.

     1. formspree.io → New form → recipient: the client's inbox
        (Formspree emails that address a one-time verification link).
     2. Copy the form's endpoint, e.g. https://formspree.io/f/abcdwxyz, below.

   SPAM. Google reCAPTCHA v3 runs invisibly on every submit; Formspree
   verifies the token server-side and drops anything that scores as a bot.

     3. google.com/recaptcha/admin → Create → type: v3 → domains: the
        production domain and <owner>.github.io → copy the SITE key below.
     4. In Formspree → the form → Settings → Spam protection → reCAPTCHA v3:
        paste the SECRET key there (never in this file).

   Leave either value empty and the site degrades gracefully: forms show
   the local "sent" state without sending (endpoint) or send without a
   captcha token (site key). A hidden honeypot field is always included. */
window.SITE = {
  siteName: "Selections",    // appears in email subjects, e.g. "Selections: contact"
  formEndpoint: "",          // e.g. "https://formspree.io/f/abcdwxyz"
  recaptchaSiteKey: "",      // e.g. "6Lc...-...-...."
  notifyEmail: "info@selectionsdesign.com",   // shown to visitors if a submission fails
};
