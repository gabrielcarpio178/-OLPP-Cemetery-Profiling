export default function UserData(){
    try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        return {
            user: user ? JSON.parse(user) : null,
            token: token || null,
        };
    } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        return {
            user: null,
            token: null,
        };
    }
}