import "./App.css";
import { useRef, useState } from "react";

function App() {
  const percents = [0.7, 0.5, 0.3];
  const [percent, setPercent] = useState(0);
  const [options, setOptions] = useState([]);
  const [text, setText] = useState("Start");
  const optionElements = useRef([]);
  let numberOfComparesions = 0;
  const fruits = [
    "apple",
    "banana",
    "mango",
    "strawberry",
    "orange",
    "watermelon",
    "grapes",
    "tangerine",
    "cantaloupe",
    "pomegranate",
  ];
  const relationships = {};
  const [rankings, setRankings] = useState([]);

  async function quickSelect(array, k) {
    if (array.length <= k) return array;

    const pivot = array[Math.floor(Math.random() * array.length)];
    const less = [];
    const greater = [];
    const equal = [pivot];

    for (const item of array) {
      if (item === pivot) continue;

      const knownRelationship = getRelationship(pivot, item);
      if (knownRelationship === "left") {
        less.push(item);
      } else if (knownRelationship === "right") {
        greater.push(item);
      } else {
        const comparisonResult = await askUser(pivot, item);
        if (comparisonResult === "left") {
          addRelationship(pivot, item);
          less.push(item);
        } else {
          addRelationship(item, pivot);
          greater.push(item);
        }
      }
    }
    if (greater.length >= k) {
      return await quickSelect(greater, k);
    } else if (greater.length + equal.length >= k) {
      return greater.concat(equal).slice(0, k);
    } else {
      const remainder = k - greater.length - equal.length;
      return greater.concat(equal, await quickSelect(less, remainder));
    }
  }

  async function mergeSort(arr) {
    let sortedArrays = arr.map((value) => [value]);
    while (sortedArrays.length > 1) {
      const newSortedArrays = [];
      for (let i = 0; i < sortedArrays.length; i += 2) {
        if (i + 1 < sortedArrays.length) {
          const merged = await merge(sortedArrays[i], sortedArrays[i + 1]);
          newSortedArrays.push(merged);
        } else {
          newSortedArrays.push(sortedArrays[i]);
        }
      }
      sortedArrays = newSortedArrays;
    }
    return sortedArrays[0];
  }

  async function merge(left, right) {
    const result = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      const relationship = getRelationship(left[i], right[j]);

      if (relationship) {
        if (relationship === "left") {
          result.push(left[i++]);
        } else {
          result.push(right[j++]);
        }
      } else {
        const choice = await askUser(left[i], right[j]);
        if (choice === "left") {
          addRelationship(left[i], right[j]);
          result.push(left[i++]);
        } else {
          addRelationship(left[i], right[j]);
          result.push(right[j++]);
        }
      }
    }
    return result.concat(left.slice(i), right.slice(j));
  }

  async function askUser(left, right) {
    numberOfComparesions++;
    return new Promise((resolve) => {
      setOptions([left, right]);
      optionElements.current[0].onclick = () => resolve("left");
      optionElements.current[1].onclick = () => resolve("right");
    });
  }
  async function startSort(list) {
    setRankings(() => []);
    numberOfComparesions = 0;
    for (var r in relationships) delete relationships[r];
    let sorted = [];
    if (percent) {
      const topXCount = Math.ceil(list.length * percent);
      const topXItems = await quickSelect(list, topXCount);
      console.log(
        "Top X items (unsorted):",
        topXItems,
        "Number of comparsions",
        numberOfComparesions
      );
      sorted = await mergeSort(topXItems);
    } else {
      sorted = await mergeSort(list);
    }
    console.log(
      "Sorted top X items:",
      sorted,
      "Number of comparsions",
      numberOfComparesions
    );
    setText("Redo");
    setRankings(sorted);
  }

  function addRelationship(item1, item2) {
    if (!relationships[item1]) relationships[item1] = new Set();
    if (!relationships[item2]) relationships[item2] = new Set();
    relationships[item1].add(item2);
    for (const inferredItem of relationships[item2] || []) {
      relationships[item1].add(inferredItem);
    }
    for (const reverseItem of relationships[item1] || []) {
      if (relationships[reverseItem]?.has(item1)) {
        console.error(
          `Conflict detected: ${item1} > ${reverseItem} and ${reverseItem} > ${item1}`
        );
      }
    }
  }

  function getRelationship(item1, item2) {
    if (relationships[item1]?.has(item2)) return "left";
    if (relationships[item2]?.has(item1)) return "right";
    return null;
  }

  return (
    <>
      <h1>Ranking calaculator prototype</h1>
      <main>
        <div
          className="choices"
          style={{ display: rankings.length ? "none" : "flex" }}
        >
          <div
            ref={(el) => (optionElements.current[0] = el)}
            className="option"
          >
            <div
              className="img"
              style={{ backgroundImage: `url(images/${options[0]}.jpg)` }}
            ></div>
            <span>{options[0]}</span>
          </div>
          <div
            ref={(el) => (optionElements.current[1] = el)}
            className="option"
          >
            <div
              className="img"
              style={{ backgroundImage: `url(images/${options[1]}.jpg)` }}
            ></div>
            <span>{options[1]}</span>
          </div>
        </div>
        <ul className="rankings">
          {rankings.map((e, i) => {
            return (
              <li key={i} className={i % 2 !== 0 ? "even" : ""}>
                <span className="rank">{i + 1}</span>
                <span className="item">{e}</span>
              </li>
            );
          })}
          {rankings.length ?
            fruits
              .filter((el) => !rankings.includes(el))
              .map((e, i) => {
                return (
                  <li key={i} className={(i + rankings.length) % 2 !== 0 ? "even" : ""}>
                    <span className="rank">-</span>
                    <span className="item">{e}</span>
                  </li>
                )
              }) : ""}
        </ul>
        <div className="buttons">
          <div
            className="start"
            onClick={() => {
              setText("Restart");
              startSort(fruits);
            }}
          >
            {text}
          </div>
        </div>
        <hr />
        <div className="settings">
          {percents.map((el) => {
            return (
              <label key={el}>
                <input
                  type="radio"
                  name="percent"
                  value={el}
                  onChange={() => setPercent(() => el)}
                  onClick={(e) => {
                    if (percent === el) {
                      e.target.checked = false;
                      setPercent(0);
                    }
                  }}
                />
                &nbsp;Get only the top {el * 100}%
              </label>
            );
          })}
        </div>
      </main>
    </>
  );
}

export default App;
