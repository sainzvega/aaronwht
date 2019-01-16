export const config = {
    api() {
        if (window.location.hostname.toLowerCase().indexOf("localhost") >= 0) {
            return "http://localhost:8000/api/"
        }

        return process.env.REACT_APP_API
    },

    imageUrl() {
        return process.env.REACT_APP_IMAGE_URL;
    }
}