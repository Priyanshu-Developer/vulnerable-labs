
interface QuerySectionProps {
  showBothQueries: boolean;
  isSecuredMode: boolean;
  secureQuery: string;
  unsecureQuery: string;
  secureParams: string[];
}

const QuerySection: React.FC<QuerySectionProps>  = ({ showBothQueries, isSecuredMode, secureQuery, unsecureQuery, secureParams }) => {
  return (
     <section className="mt-3 space-y-2 rounded-xl border border-(--line) bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-(--brand)">Realtime SQL Preview</p>
            {(showBothQueries || isSecuredMode) && (
              <div className={`rounded-lg border px-3 py-2 ${isSecuredMode ? "border-(--brand) bg-[#f3fbf9]" : "border-(--line)"}`}>
                <p className="mb-1 text-xs font-semibold text-(--brand)">Secured query</p>
                <code className="block whitespace-pre-wrap wrap-break-word text-xs">{secureQuery}</code>
                <p className="mt-2 text-xs text-muted">Params: [{secureParams.map((value) => `"${value}"`).join(", ")}]</p>
              </div>
            )}
            {(showBothQueries || !isSecuredMode) && (
              <div className={`rounded-lg border px-3 py-2 ${!isSecuredMode ? "border-amber-400 bg-amber-50" : "border-(--line)"}`}>
                <p className="mb-1 text-xs font-semibold text-amber-700">Unsecured query</p>
                <code className="block whitespace-pre-wrap wrap-break-words text-xs">{unsecureQuery}</code>
              </div>
            )}
          </section>
  );
}
export default QuerySection;