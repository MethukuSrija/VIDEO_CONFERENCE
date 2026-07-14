import Avatar from "../common/Avatar";

export default function ParticipantItem({ participant }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg">
      <Avatar name={participant.name} src={participant.picture} size="sm" />
      <div className="flex-1">
        <p className="font-medium">{participant.name}</p>
        <p className="text-xs text-gray-400">{participant.role}</p>
      </div>
    </div>
  );
}
