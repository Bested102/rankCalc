import { PropTypes } from "prop-types";

function Estimates({ n, k }) {
  function getLog(x, y) {
    return Math.log(y) / Math.log(x);
  }
  const estimates = {
    Quickselect: {
      Average: (2 * n - k) * 0.85,
      "Worst Case": ((k * (2 * n - k + 1)) / 2) * 0.85,
    },
    "Merge Sort": {
      Average: k * getLog(2, k) * 0.85,
      "Worst Case": "-",
    },
    Total: {
      Average: (2 * n - k + k * getLog(2, k)) * 0.85,
      "Worst Case": ((k * (2 * n - k + 1)) / 2 + k * getLog(2, k)) * 0.85,
    },
  };

  if (n === k) {
    estimates.Total = estimates["Merge Sort"];
    estimates.Quickselect = {
      Average: "-",
      "Best Case": "-",
    };
  }
  return (
    <table className="estimates">
      <tbody>
        <tr>
          <td></td>
          <td>Average</td>
          <td>Worst Case</td>
        </tr>
        {Object.keys(estimates).map((e, i) => {
          return (
            <tr key={i}>
              <th>{e}</th>
              {Object.values(estimates[e]).map((k, i) => (
                <td key={i}>{typeof k == "number" ? Math.floor(k) : k}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Estimates.propTypes = {
  n: PropTypes.number,
  k: PropTypes.number,
};

export default Estimates;
