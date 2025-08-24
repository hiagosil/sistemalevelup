import { useHunter } from '@/hooks/useHunter';
import { AuthScreen } from '@/components/AuthScreen';
import { HunterDashboard } from '@/components/HunterDashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { hunter, dailyProgress, isLoading, createHunter, completeMission, logout } = useHunter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando dados do caçador...</p>
        </div>
      </div>
    );
  }

  if (!hunter || !dailyProgress) {
    return <AuthScreen onCreateHunter={createHunter} />;
  }

  return (
    <HunterDashboard
      hunter={hunter}
      dailyProgress={dailyProgress}
      onCompleteMission={completeMission}
      onLogout={logout}
    />
  );
};

export default Index;
