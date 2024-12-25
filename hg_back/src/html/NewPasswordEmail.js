const NewPasswordEmail = () => {
    const subject = "GoEnglish - Password change";
    const body = `
        <h1>Password Change</h1>
        <h2>Your password change request was successfully completed.</h2>
        <p>If you didn't request this change, contact system administration.</p>
    `;

    return { subject, body };
};

module.exports = NewPasswordEmail;
