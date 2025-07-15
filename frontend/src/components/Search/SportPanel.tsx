import { useSportStore } from "../../stores/sportStore";
import Tag from "../Common/Tag";
import { useSports } from "../../hooks/useSports";
import { useLeagues } from "../../hooks/useLeagues";
import { getUpdatedLeagueSelection } from "../../utils/sportUtils";

const SportPanel = () => {
  const { sport, selectedLeagues, setSport, setSelectedLeagues } =
    useSportStore();

  const { data: sports = [] } = useSports();
  const selectedSportId = sports.find((s) => s.name === sport)?.id;
  const { data: leagues = [] } = useLeagues(selectedSportId);

  const handleLeagueClick = (leagueName: string) => {
    const updated = getUpdatedLeagueSelection(
      selectedLeagues,
      sport,
      leagueName
    );
    setSelectedLeagues(updated);
  };

  return (
    <div className="flex flex-col max-h-[500px]">
      <div className="flex divide-x overflow-hidden border-b h-[300px]">
        <div className="w-1/2 overflow-y-auto">
          {sports.map((s) => (
            <div
              key={s.id}
              onClick={() => setSport(s.name)}
              className={`p-3 cursor-pointer hover:bg-gray-100 ${
                s.name === sport ? "font-bold text-primary5" : ""
              }`}
            >
              {s.name}
            </div>
          ))}
        </div>

        <div className="w-1/2 overflow-y-auto">
          {leagues.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-400 text-center">
              <p>종목을 선택하면</p>
              <p>리그를 확인할 수 있습니다</p>
            </div>
          ) : (
            leagues.map((l) => {
              const isChecked = selectedLeagues.some(
                (r) => r.sport === sport && r.league === l.name
              );

              return (
                <label
                  key={l.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <span>{l.name}</span>
                  <input
                    type="checkbox"
                    className="accent-primary1"
                    checked={isChecked}
                    onChange={() => handleLeagueClick(l.name)}
                  />
                </label>
              );
            })
          )}
        </div>
      </div>

      {selectedLeagues.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border-gray-200">
          {selectedLeagues.map((r) => {
            const label =
              r.league === "전체"
                ? `${r.sport} 전체`
                : `${r.sport} ${r.league}`;

            return (
              <Tag
                key={`${r.sport}-${r.league}`}
                label={label}
                onRemove={() => {
                  const updated = getUpdatedLeagueSelection(
                    selectedLeagues,
                    r.sport,
                    r.league
                  );
                  setSelectedLeagues(updated);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SportPanel;
