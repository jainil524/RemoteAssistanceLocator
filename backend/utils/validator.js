const varifyEmail = (email) => {

    if(email.length === 0) return {status: "error", message: "Email is required"};

    const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let result = reg.test(email);

    if (result) {
        return {status: "success", message: "Email is valid"};
    } else {
        return {status: "error", message: "Email is not valid"};
    }
};

const varifyPassword = (password) => {

    if(password.length === 0) return {status: "error", message: "Password is required"};

    if(password.length < 8) return {status: "error", message: "Password must be at least 8 characters long"};

    if(password.length > 20) return {status: "error", message: "Password must be less than 20 characters long"};

    if(!/[a-z]/.test(password)) return {status: "error", message: "Password must contain at least one lowercase letter"};

    if(!/[A-Z]/.test(password)) return {status: "error", message: "Password must contain at least one uppercase letter"};

    if(!/[0-9]/.test(password)) return {status: "error", message: "Password must contain at least one number"};

    if(!/[!@#$%^&*]/.test(password)) return {status: "error", message: "Password must contain at least one special character"};
    
    return {status: "success", message: "Password is valid"};
}

const varifyPhone = (phone) => {
    if(phone.length === 0) return {status: "error", message: "Phone number is required"};

    if(phone.length !== 10) return {status: "error", message: "Phone number must be 10 digits long"};

    return {status: "success", message: "Phone number is valid"};
}

module.exports = {
    varifyEmail,
    varifyPhone,
    varifyPassword
};