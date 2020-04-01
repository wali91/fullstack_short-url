import axios from "axios";

const API_URL = process.env.VUE_APP_ROOT_API + "users/";

class AuthService {
  login(identity) {
    return axios
      .post(
        API_URL + "login",
        {
          email: identity.email,
          password: identity.password
        },
        {
          withCredentials: true
        }
      )
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    return axios
      .post(
        API_URL + "logout",
        {},
        {
          withCredentials: true
        }
      )
      .then(() => {
        localStorage.removeItem("user");
      });
  }

  register(identity) {
    return axios
      .post(
        API_URL + "register",
        {
          email: identity.email,
          password: identity.password
        },
        {
          withCredentials: true
        }
      )
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }
}

export default new AuthService();
