import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LikedProfiles = () => {
  const location = useLocation();
  useEffect(() => {
    // console.log(location.state);
  }, []);
  return <div>Liked</div>;
};

export default LikedProfiles;
