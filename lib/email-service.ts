// Alternative email service for password reset
// This can be used instead of Firebase's built-in email service

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

// Example using EmailJS (free service)
export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  // You can integrate with EmailJS, SendGrid, or other email services
  // This is just a placeholder for the structure
  
  const emailData = {
    to: email,
    subject: "Resetowanie hasła - Mózg na Maxa",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #e3f7ff; padding: 20px; text-align: center;">
          <h1 style="color: #3e459c; margin: 0;">Mózg na Maxa</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #3e459c;">Resetowanie hasła</h2>
          <p>Otrzymałeś tę wiadomość, ponieważ poprosiłeś o resetowanie hasła do swojego konta nauczyciela w Mózg na Maxa.</p>
          <p>Kliknij poniższy przycisk, aby zresetować hasło:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #3e459c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Zresetuj hasło
            </a>
          </div>
          <p>Jeśli nie prosiłeś o resetowanie hasła, zignoruj tę wiadomość.</p>
          <p>Link jest ważny przez 1 godzinę.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Mózg na Maxa - Platforma edukacyjna<br>
            Ten email został wysłany automatycznie, nie odpowiadaj na niego.
          </p>
        </div>
      </div>
    `,
    text: `
      Resetowanie hasła - Mózg na Maxa
      
      Otrzymałeś tę wiadomość, ponieważ poprosiłeś o resetowanie hasła do swojego konta nauczyciela w Mózg na Maxa.
      
      Aby zresetować hasło, kliknij poniższy link:
      ${resetLink}
      
      Jeśli nie prosiłeś o resetowanie hasła, zignoruj tę wiadomość.
      Link jest ważny przez 1 godzinę.
      
      Mózg na Maxa - Platforma edukacyjna
    `
  }
  
  // Here you would integrate with your chosen email service
  // For now, this is just a template
  console.log("Would send email:", emailData)
  
  // Return a promise that resolves when email is sent
  return Promise.resolve()
}

// Alternative: Generate a custom reset link that doesn't rely on Firebase emails
export const generateCustomResetLink = (email: string, token: string) => {
  return `https://mozgnamaxa-3.vercel.app/reset-password?email=${encodeURIComponent(email)}&token=${token}`
}
