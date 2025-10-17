import { Bounce, toast } from 'react-toastify'

export const toastAlert = (obj)=> {
if (obj.type === "success") {
       return toast.success(obj.message, {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
});
} if (obj.type === "error") {
       return toast.error(obj.message, {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
});
}
}