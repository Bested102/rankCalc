import { PropTypes } from "prop-types";
import { useRef, useState } from "react";

function List({ list, original, open, setOpen, setList }) {
  const [edited, setEdited] = useState(list);
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const input = useRef(0);
  return (
    <div className={`list-outer ${open ? "open" : ""}`}>
      <div className="list">
        <span
          className="close"
          onClick={() => {
            setOpen((o) => !o);
            setEdited(list);
          }}
        >
          x
        </span>
        <ul>
          {edited.map((e, i) => {
            return (
              <li
                key={i}
                className={
                  (i % 2 === 0 ? "even " : "") + (e.disabled ? "disabled" : "")
                }
              >
                <span>{e.name.charAt(0).toUpperCase() + e.name.slice(1)}</span>
                <img src={e.img} alt="" />
                <span
                  className="disable"
                  onClick={() => {
                    setEdited((arr) => {
                      if ("disabled" in arr[i]) {
                        return arr.map((o, c) =>
                          c === i ? { ...o, disabled: !o.disabled } : o
                        );
                      } else {
                        return arr.filter((e, s) => s !== i);
                      }
                    });
                  }}
                >
                  x
                </span>
              </li>
            );
          })}
          <li className={`new ${edited.length % 2 === 0 ? "even" : ""}`}>
            <input
              type="text"
              placeholder="new item"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="file">
              Upload Img
              <input
                ref={input}
                type="file"
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            {img && <img src={URL.createObjectURL(img)} alt="" />}
            <span
              className="add"
              onClick={() => {
                if (name && img) {
                  setEdited((arr) => [
                    ...arr,
                    { name: name, img: URL.createObjectURL(img) },
                  ]);
                  input.current.value = "";
                  setImg("");
                  setName("");
                }
              }}
            >
              Add
            </span>
          </li>
        </ul>
        <div className="buttons">
          <div
            className="reset"
            onClick={() => {
              setEdited(original);
              setList(original);
              localStorage.setItem("list", JSON.stringify(original));
            }}
          >
            Reset
          </div>
          <div
            className="save"
            onClick={() => {
              setList(edited);
              localStorage.setItem("list", JSON.stringify(edited));
            }}
          >
            Save
          </div>
        </div>
      </div>
    </div>
  );
}

List.propTypes = {
  list: PropTypes.array,
  original: PropTypes.array,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  setList: PropTypes.func,
};

export default List;
