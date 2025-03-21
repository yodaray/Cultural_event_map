import GLB from "../Setting.js";

async function UserPwChg(datas) {
  let API = `${GLB.backend}/UserPwChg`;
  return fetch(API, { method: "post", body: datas })
    .then(data => data.json())
    .catch(err => window.alert(err));
}

const UserPasswordChange = () => {
  const getPwChg = async (event, o_pw, n_pw) => {
    event.preventDefault();
    if (o_pw == n_pw) {
      window.alert("You cannot use the original password as the new password!");
      return;
    }
    const userName = window.sessionStorage.getItem("UserName")
    let data = new URLSearchParams();
    data.append("o_pw", o_pw);
    data.append("n_pw", n_pw);
    data.append('user_Name', userName)

    const change_status = await UserPwChg(data);
    if (!change_status) {
      window.alert("Cannot Change Password");
    } else {
      window.alert("Password is successfully changed!")
      // Reset input values
      document.getElementById("original_pw").value = "";
      document.getElementById("new_pw").value = "";
    }
  };

  return (
    <>
      <section>
        <div className="Home container">
          <div className="row card">
            <h2>Change Password</h2>
            <form>
              <label htmlFor="original_pw">Enter your original password</label>
              <input
                type="string"
                id="original_pw"
                name="original_pw"
                className="original_pw form-control"
                placeholder="Enter Your Password"
                required
              ></input>
              <br></br>
              <label htmlFor="new_pw">Enter a new password</label>
              <input
                type="string"
                id="new_pw"
                name="new_pw"
                className="new_pw form-control"
                placeholder="Enter Your Password"
                required
              ></input>
              <br></br>
              <button
                className="btn btn-lg btn-block"
                type="button"
                style={{ fontSize: "20px", padding: "10px" }}
                onClick={(e) =>
                  getPwChg(
                    e,
                    document.getElementById("original_pw").value,
                    document.getElementById("new_pw").value
                  )
                }
              >
                Change
              </button>
            </form>
            <br></br>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserPasswordChange;