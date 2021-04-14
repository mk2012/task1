import React from "react";
import { Input, Button } from "antd";

function addBio() {
  const { TextArea } = Input;

  return (
    <div>
      <div>
        <h1> Add Bio </h1>
        <TextArea
          style={{ width: "30%", marginTop: "20px", marginRight: "30px" }}
          rows={4}
        />
      </div>
      <div>
        <Button style={{ marginTop: "20px" }}>Submit</Button>
      </div>
    </div>
  );
}

export default addBio;
