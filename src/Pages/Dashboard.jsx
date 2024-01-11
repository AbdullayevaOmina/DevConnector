import { Spinner } from "react-bootstrap";
import useFetch from "../Hooks/useFetch";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa6";


const Dashboard = () => {
  async function deleteAcount() {
    if (confirm("Hisobingizni o'chirishga aminmisiz?")) {
      try {
        console.log(localStorage.getItem(localTokenKey));
        await axios.delete("/profile", localStorage.getItem(localTokenKey));

        toast("Deleted", { type: "success" });
        localStorage.removeItem(localTokenKey);
        navigate("/login");
      } catch (error) {
        if (error.response.status === 400) {
          error.response.data.errors.forEach((err) =>
            toast(err.msg, { type: "error" })
          );
        } else {
          console.log(error);
        }
      }
    }
  }

  const { data: profile, isLoading } = useFetch("/profile/me");

  return isLoading ? (
    <Spinner />
  ) : profile ? (
    <main className="container my-5">
      <h1 className="mb-3 display-4 fw-bold display-color">Dashboard</h1>
      <p className="text-dark fs-4">
        <FaUser /> Welcome <b className="userName">{profile.user.name}</b>
      </p>
      <div className="section">
        <div className=" d-flex gap-4 mt-4">
          <Link to="/profile">
            <button className="whiteBtn border rounded-1 hover-effect-1">
              Edit profile
            </button>
          </Link>
          <Link to="/Add_exp">
            <button className="whiteBtn border rounded-1 hover-effect-1">
              Add Experiance
            </button>
          </Link>
          <Link to="/add_edu">
            <button className="whiteBtn border rounded-1 hover-effect-1">
              Add Education
            </button>
          </Link>
        </div>
        <p className="fs-4 my-3 mt-5">Experience Credentials</p>
        <table className="table table-bordered table-success table-striped w-75">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <p className="fs-4 my-3 mt-5">Education Credentials</p>
        <table className="table table-bordered table-success table-striped w-75">
          <thead>
            <tr>
              <th>School</th>
              <th>Degree</th>
              <th>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{}</tbody>
        </table>
        <button className="btn btn-danger mt-4" onClick={deleteAcount}>
          Delete My Account
        </button>
      </div>
    </main>
  ) : (
    <div>create a profile please.</div>
  );
};

export default Dashboard;
