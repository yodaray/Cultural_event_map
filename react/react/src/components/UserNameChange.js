import GLB from "../Setting.js";

async function UserNChg(datas) {
  let API = `${GLB.backend}/UserNameChg`;
  return fetch(API, { method: "post", body: datas })
    .then(data => data.json())
    .catch(err => window.alert(err));
}

const UserNameChange = () => {
  const getNameChg = async (event, n_new) => {
    event.preventDefault();
    const userAc = window.sessionStorage.getItem("UserAc");

    let data = new URLSearchParams();
    data.append("new_name", n_new);
    data.append("userAc", userAc);

    const change_status = await UserNChg(data);
    if (!change_status) {
      window.alert("Cannot Change Name");
    } else {
      window.sessionStorage.setItem("UserName", n_new);
      window.alert("Nickname Changed");
    }
  };

  return (
    <>
      <section>
        <div className="Home container">
          <div className="row card">
            <h2>Change User Nickname</h2>
            <form>
              <label htmlFor="n_new">Enter a New Nickname</label>
              <input
                type="string"
                id="n_new"
                name="n_new"
                className="n_new form-control"
                placeholder="Enter Your new nickname"
                required
              ></input>
              <br></br>
              <button
                className="btn btn-lg btn-block"
                type="button"
                style={{ fontSize: "20px", padding: "10px" }}
                onClick={(e) =>
                  getNameChg(
                    e,
                    document.getElementById("n_new").value,
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

export default UserNameChange;