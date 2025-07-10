import { useEffect, useState } from "react";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { createBroadcast, editBroadcast } from "../../../../api/broadcast.api";
import { fetchSports, fetchLeagues } from "../../../../api/staticdata.api";
import useBroadcastStore from "../../../../stores/broadcastStore";
import useBroadcastFormStore, {
  handleLeagueChange,
  handleSportChange,
} from "../../../../stores/broadcastFormStore";
import SportSelect from "../../../Select/SportSelect";
import LeagueSelect from "../../../Select/LeagueSelect";
import type { BroadcastRegisterEditProps } from "../../../../types/broadcastForm";
import useMypageStore from "../../../../stores/mypageStore";

const BroadcastRegisterEdit = (props: BroadcastRegisterEditProps) => {
  const {
    date,
    time,
    sportId,
    leagueId,
    team1,
    team2,
    note,
    setDate,
    setTime,
    setLeague,
    setteam1,
    setteam2,
    setNote,
    setInitialForm,
    resetForm,
  } = useBroadcastFormStore();

  const { broadcastLists } = useBroadcastStore();
  const [sports, setSports] = useState<{ id: number; name: string }[]>([]);
  const [leagues, setLeagues] = useState<{ id: number; name: string }[]>([]);
  const { setRestaurantSubpage } = useMypageStore();

  useEffect(() => {
    fetchSports().then(setSports);
  }, []);

  useEffect(() => {
    if (sportId) {
      fetchLeagues(sportId).then((res: { id: number; name: string }[]) => {
        setLeagues(res);
        const leagueIds = res.map((l) => l.id);
        if (leagueId !== null && !leagueIds.includes(leagueId)) {
          setLeague("", null);
        }
      });
    } else {
      setLeagues([]);
      setLeague("", null);
    }
  }, [sportId]);

  useEffect(() => {
    if (props.mode === "edit" && props.broadcastId != null) {
      const target = broadcastLists.find(
        (b) => b.broadcast_id === props.broadcastId
      );

      if (!target) {
        console.error("수정할 중계 정보를 찾을 수 없습니다.");
        return;
      }

      fetchSports().then((sports: { id: number; name: string }[]) => {
        const sportMatch = sports.find(
          (s: { id: number; name: string }) => s.name === target.sport
        );
        if (sportMatch) {
          handleSportChange(sportMatch.name, sportMatch.id);
          fetchLeagues(sportMatch.id).then(
            (leagues: { id: number; name: string }[]) => {
              const leagueMatch = leagues.find(
                (l: { id: number; name: string }) => l.name === target.league
              );
              if (leagueMatch) {
                handleLeagueChange(leagueMatch.name, leagueMatch.id);
              }

              setInitialForm({
                date: dayjs(target.match_date),
                time: dayjs(target.match_time, "HH:mm"),
                sport: target.sport,
                league: target.league,
                team1: target.team_one,
                team2: target.team_two,
                note: target.etc,
              });
            }
          );
        }
      });
    }
  }, [props.mode, props.broadcastId, broadcastLists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !sportId || !leagueId) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    const commonPayload = {
      match_date: date.format("YYYY-MM-DD"),
      match_time: time.format("HH:mm"),
      sport_id: sportId,
      league_id: leagueId,
      team_one: team1 ?? "",
      team_two: team2 ?? "",
      etc: note,
    };

    try {
      if (props.mode === "create") {
        const createPayload = {
          ...commonPayload,
          store_id: props.storeId,
        };
        await createBroadcast(createPayload);
        alert("중계 일정 등록 완료");
        setRestaurantSubpage("schedule-view-broadcasts");
      } else if (props.mode === "edit" && props.broadcastId != null) {
        await editBroadcast(props.broadcastId, commonPayload);
        alert("중계 일정 수정 완료");
        setRestaurantSubpage("schedule-view-broadcasts");
      }

    } catch {
      alert(`오류가 발생했습니다. 다시 시도해주세요.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 text-mainText">날짜</label>
          <DatePicker
            className="w-full"
            value={date}
            onChange={(v) => v && setDate(v)}
            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 text-mainText">시간</label>
          <TimePicker
            className="w-full"
            format="HH:mm"
            value={time}
            onChange={(v) => setTime(v)}
            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-[180px]">
          <SportSelect
            value={sportId ?? ""}
            options={sports}
            onChange={(id, name) => handleSportChange(name, id)}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <LeagueSelect
            value={leagueId ?? ""}
            options={leagues}
            onChange={(id, name) => handleLeagueChange(name, id)}
            disabled={!sportId}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 text-mainText">팀 1</label>
          <input
            value={team1 ?? ""}
            onChange={(e) => setteam1(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block mb-1 text-mainText">팀 2</label>
          <input
            value={team2 ?? ""}
            onChange={(e) => setteam2(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-mainText">기타</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border px-3 py-2 rounded hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setRestaurantSubpage("schedule-view-broadcasts");
          }}
          className="px-4 py-2 rounded bg-gray-100"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary5 text-white"
        >
          {props.mode === "edit" ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
};

export default BroadcastRegisterEdit;
