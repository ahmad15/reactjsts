import Modal from "../components/Modal";

function reLogin() {
  sessionStorage.removeItem('token');
  window.location.href = '/login';
}

const errorHandler = (error: any) => {
  const isUnauthorized = error.response?.status === 401 && error.response?.data?.code === "TOKEN_NOT_VALID";

  if (isUnauthorized) {
    return <Modal
      id="token-error"
      title="Invalid Token"
      text="Your session has expired. Please log in again."
      btnOK="Login"
      isOpen={true}
      onProsess={() => reLogin()}
      onClose={() => reLogin()}
    />
  }

  if (error.code === "ECONNABORTED") {
    return "A timeout has occurred";
  } else if (error.response?.data?.message) {
    return error.response.data.message;
  } else {
    return "An unexpected error has occurred";
  }
}

export default errorHandler;