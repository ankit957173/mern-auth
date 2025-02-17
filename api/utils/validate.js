
export const validateUsername = (username) => {
    // Check if username contains any spaces
    if (!username || /\s/.test(username)) {
        return "Username cannot be empty or contain spaces.";
    }

    return null; // Username is valid
};
export const validateEmail = (email) => {
    // Check if email is valid
    if (!email) return "Please enter an email address.";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return "Invalid email address.";
    return null; // Email is valid
}
export const validatePassword = (password) => {
    // ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$
    // Check if password length is at least 5 characters
    if (!password) return "Please enter a password.";
    if (password.length < 5) return "Password must be at least 5 characters long.";

    // Check if password contains at least one special character
    if (!/(?=.*[!@#\$%\^&\*])/.test(password)) return "Password must contain at least 1 special character.";

    // Check if password contains any spaces
    if (/\s/.test(password)) return "Password must not contain spaces.";

    return null; // Password is valid
};

