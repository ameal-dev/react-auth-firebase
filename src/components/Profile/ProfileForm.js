import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
	const newPasswordInputRef = useRef();
	const history = useHistory();

	const authCtx = useContext(AuthContext);

	const submitHandler = (e) => {
		e.preventDefault();
		const enteredNewPassword = newPasswordInputRef.current.value;
		//! add validation
		if (enteredNewPassword) {
			fetch(
				"https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBqbStCqLD7iVYfCTTmq6rx5CpSmlHAa54",
				{
					method: "POST",
					body: JSON.stringify({
						idToken: authCtx.token,
						password: enteredNewPassword,
						returnSecureToken: true,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}
			).then((res) => {
				//! assumption: always succeeds!
				history.replace("/");
			});
		}
	};

	return (
		<form className={classes.form} onSubmit={submitHandler}>
			<div className={classes.control}>
				<label htmlFor='new-password'>New Password</label>
				<input
					type='password'
					id='new-password'
					minLength={5}
					ref={newPasswordInputRef}
				/>
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;
