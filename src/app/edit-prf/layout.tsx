import React from "react";

type Props = {};

function EditPrf({}: Props) {
  return (
    <>
      <div>Fetch existing PRFs</div>
      <div>List them</div>
      <div>Allow user to select a PRF to edit</div>
      <div>
        Navigate to the dynamic page (PRF-ID will be in the url) with the
        information so it can be edited
      </div>
    </>
  );
}

export default EditPrf;
