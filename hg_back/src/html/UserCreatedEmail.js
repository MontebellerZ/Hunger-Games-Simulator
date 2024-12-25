const LINK_ANDROID_STORE = process.env.LINK_ANDROID_STORE;
const LINK_APPLE_STORE = process.env.LINK_APPLE_STORE;

const UserCreatedEmail = (name, email, password) => {
    const subject = `GoEnglish - Account created for ${name}`;
    const body = `
        <h1>Welcome, ${name}!</h1>
        <h2>You were assigned to a new account on GoEnglish - Leads app!</h2>
        <p>Here is your credentials to login:</p>
        <ul>
            <li><b>Login:</b> ${email}</li>
            <li><b>Password:</b> ${password}</li>
        </ul>
        <br>
        <p>Login to the app on your mobile phone to change your password and start counting your leads.</p>
        <p>If you do not have the app, download it on the best link for you:</p>
        <ul>
            <li>
                <a href='${LINK_ANDROID_STORE}'>Android App</a>
            </li>
            <li>
                <a href='${LINK_APPLE_STORE}'>iOS App</a>
            </li>
        </ul>
    `;

    return { subject, body };
};

module.exports = UserCreatedEmail;
