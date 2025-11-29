interface PaginationPrompt {
  currentNumber: number;
  numbers: number[];
  setCurrentNumber: (num: number) => void;
}

const Pagination = ({
  currentNumber,
  numbers,
  setCurrentNumber,
}: PaginationPrompt) => {
  return (
    <div className="pagination">
      {numbers.length > 1 &&
        numbers.map((num) => (
          <button
            key={num}
            className={`pagination-btn ${currentNumber == num ? "active" : ""}`}
            onClick={() => setCurrentNumber(num)}
          >
            {num}
          </button>
        ))}
    </div>
  );
};

export default Pagination;
