import * as React from "react";
import { useState } from "react";
import { Input, Button, message } from "antd";

import { useHistory } from "react-router-dom";
import axios from "axios";
import { USER_SERVER } from "../../Config";

function AddBio() {
  const { TextArea } = Input;
  const [bio, setBio] = useState(" ");
  const [myname, setName] = useState("");

  let history = useHistory();

  //send bio to db
  const handleSubmit = () => {
    // history.push({
    //   pathname: "/myprofile",
    //   state: { detail: bio, state2: name },
    // });
    var id = localStorage.getItem("userId");
    var name = myname;
    var description = bio;
    var data = {
      name,
      description,
      id,
    };
    axios
      .post(`${USER_SERVER}/myprofile/${id}`, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        message.info("Update Failed");
        console.log(err);
      });
    message.info("Successfully Updated");
    history.push({ pathname: "/myprofile", state: "added" });
  };

  return (
    <div>
      <div>
        <h1> Add Bio </h1>
        <label>Name</label>
        <Input onChange={(e) => setName(e.target.value)} />

        <TextArea
          style={{ width: "30%", marginTop: "20px", marginRight: "30px" }}
          rows={4}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div>
        <Button onClick={handleSubmit} style={{ marginTop: "20px" }}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default AddBio;
