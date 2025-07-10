// import { useEffect, useState } from "react";
// import { DatePicker, TimePicker } from "antd";
// import useBroadcastFormStore from "../../../../stores/broadcastFormStore";
// import { fetchSports, fetchLeagues } from "../../../../api/staticdata.api";
// import SportSelect from "../../../Select/SportSelect";
// import LeagueSelect from "../../../Select/LeagueSelect";
// import type {
//   BroadcastFormData,
//   BroadcastFormModalProps,
// } from "../../../../types/broadcastForm";
// import {
//   handleSportChange,
//   handleLeagueChange,
// } from "../../../../stores/broadcastFormStore";

// const BroadcastFormModal = ({
//   mode,
//   onSubmit,
//   broadcastId,
//   onClose,
// }: BroadcastFormModalProps) => {
//   const {
//     date,
//     time,
//     sport,
//     sportId,
//     league,
//     leagueId,
//     team1,
//     team2,
//     note,
//     setDate,
//     setTime,
//     setLeague,
//     setteam1,
//     setteam2,
//     setNote,
//     resetForm,
//   } = useBroadcastFormStore();

//   const [sports, setSports] = useState<{ id: number; name: string }[]>([]);
//   const [leagues, setLeagues] = useState<{ id: number; name: string }[]>([]);

//   useEffect(() => {
//     fetchSports().then(setSports);
//   }, []);

//   useEffect(() => {
//     if (sportId) {
//       fetchLeagues(sportId).then((res: { id: number; name: string }[]) => {
//         setLeagues(res);
//         const leagueIds = res.map((l) => l.id);
//         if (leagueId !== null && !leagueIds.includes(leagueId)) {
//           setLeague("", null);
//         }
//       });
//     } else {
//       setLeagues([]);
//       setLeague("", null);
//     }
//   }, [sportId]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!date || !time || !sportId || !leagueId) {
//       alert("모든 필수 항목을 입력해주세요.");
//       return;
//     }

//     const match_date = date.format("YYYY-MM-DD");
//     const match_time = time.format("HH:mm");

//     const data: BroadcastFormData = {
//       match_date,
//       match_time,
//       sport,
//       sport_id: sportId,
//       league,
//       league_id: leagueId,
//       team_one: team1 ?? "",
//       team_two: team2 ?? "",
//       etc: note,
//     };

//     if (mode === "edit") {
//       if (broadcastId == null) {
//         alert("수정할 항목 ID가 없습니다.");
//         return;
//       }
//       onSubmit(broadcastId, data);
//     } else {
//       onSubmit(data);
//     }

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
//         <h3 className="text-xl font-bold mb-6">
//           {mode === "edit" ? "중계 일정 수정" : "중계 일정 등록"}
//         </h3>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block mb-1">날짜</label>
//               <DatePicker
//                 className="w-full"
//                 value={date}
//                 onChange={(v) => v && setDate(v)}
//                 getPopupContainer={(trigger) =>
//                   trigger.parentNode as HTMLElement
//                 }
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block mb-1">시간</label>
//               <TimePicker
//                 className="w-full"
//                 format="HH:mm"
//                 value={time}
//                 onChange={(v) => setTime(v)}
//                 getPopupContainer={(trigger) =>
//                   trigger.parentNode as HTMLElement
//                 }
//               />
//             </div>
//           </div>

//           <SportSelect
//             value={sportId ?? ""}
//             options={sports}
//             onChange={(id, name) => {
//               handleSportChange(name, id);
//             }}
//           />

//           <LeagueSelect
//             value={leagueId ?? ""}
//             options={leagues}
//             onChange={(id, name) => {
//               handleLeagueChange(name, id);
//             }}
//             disabled={!sportId}
//           />

//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block mb-1">팀 1</label>
//               <input
//                 className="w-full border rounded px-3 py-2 hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
//                 value={team1 ?? ""}
//                 onChange={(e) => setteam1(e.target.value)}
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block mb-1">팀 2</label>
//               <input
//                 className="w-full border rounded px-3 py-2 hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
//                 value={team2 ?? ""}
//                 onChange={(e) => setteam2(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1">기타</label>
//             <textarea
//               className="w-full border rounded px-3 py-2 hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
//               rows={3}
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//             />
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               type="button"
//               onClick={() => {
//                 resetForm();
//                 onClose();
//               }}
//               className="px-4 py-2 rounded bg-gray-100"
//             >
//               취소
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 rounded bg-primary5 text-white"
//             >
//               {mode === "edit" ? "수정" : "등록"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BroadcastFormModal;
