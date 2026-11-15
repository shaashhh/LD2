import { ArchiveApp } from "@/components/ArchiveApp";
import { PlayerProvider } from "@/context/PlayerContext";

export default function HomePage() {
  return (
    <PlayerProvider>
      <ArchiveApp />
    </PlayerProvider>
  );
}
