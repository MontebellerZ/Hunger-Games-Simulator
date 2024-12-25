const ResetPasswordEmail = (password) => {
    const subject = "GoEnglish - Password reset";
    const body = `
        <h1>Password Reset</h1>
        <h2>Your password reset request was successfully completed.</h2>
        <p>Your new password: <b>${password}</b></p>
    `;

    return { subject, body };
};

module.exports = ResetPasswordEmail;
