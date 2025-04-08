export function Card({ className, children }) {
    return (
      <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow ${className}`}>
        {children}
      </div>
    );
  }