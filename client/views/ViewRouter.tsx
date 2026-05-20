import type { ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { useApp } from '../app/AppContext';
import { ErrorBoundary } from '../lib/errorBoundary';
import { ViewOverlays } from './ViewOverlays';
import { HomeView } from './HomeView';
import { CommunitySelectorView } from './CommunitySelectorView';
import { CommunityView } from './CommunityView';
import { CategoryServicesView } from './CategoryServicesView';
import { PostDetailView } from './PostDetailView';
import { LegendListView } from './LegendListView';
import { GameDetailView } from './GameDetailView';
import { ProfileView } from './ProfileView';
import { AllReviewsView } from './AllReviewsView';
import { ImView } from './ImView';
import { ContactsView } from './ContactsView';
import { ImDetailView } from './ImDetailView';
import { MeView } from './MeView';
import { MyOrdersView } from './MyOrdersView';
import { RechargeRouteView } from './RechargeRouteView';
import { WithdrawView } from './WithdrawView';
import { ApplyPlayerView } from './ApplyPlayerView';
import { ApplyPlayerCategoryView } from './ApplyPlayerCategoryView';
import { ApplyPlayerDetailsView } from './ApplyPlayerDetailsView';
import { SettingsView } from './SettingsView';
import { SettingsEditProfileView } from './SettingsEditProfileView';
import { SettingsChangePasswordView } from './SettingsChangePasswordView';
import { SettingsLinkedAccountsView } from './SettingsLinkedAccountsView';
import { SettingsLanguageView } from './SettingsLanguageView';
import { SettingsPrivacyView } from './SettingsPrivacyView';
import { SettingsTermsView } from './SettingsTermsView';
import { WalletRouteView } from './WalletRouteView';
import { PlayerProfileEditView } from './PlayerProfileEditView';
import { NotificationsView } from './NotificationsView';
import { OrderConfirmView } from './OrderConfirmView';

function ViewGate({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export function ViewRouter() {
  const { currentView, selectedPost, selectedEPal, selectedVariant } = useApp();

  return (
    <>
      <AnimatePresence mode="wait">
        {currentView === 'HOME' && <ViewGate><HomeView /></ViewGate>}
        {currentView === 'COMMUNITY_SELECTOR' && <ViewGate><CommunitySelectorView /></ViewGate>}
        {currentView === 'COMMUNITY' && <ViewGate><CommunityView /></ViewGate>}
        {currentView === 'CATEGORY_SERVICES' && <ViewGate><CategoryServicesView /></ViewGate>}
        {currentView === 'POST_DETAIL' && selectedPost && <ViewGate><PostDetailView /></ViewGate>}
        {currentView === 'LEGEND_LIST' && <ViewGate><LegendListView /></ViewGate>}
        {currentView === 'GAME_DETAIL' && <ViewGate><GameDetailView /></ViewGate>}
        {currentView === 'PROFILE' && selectedEPal && <ViewGate><ProfileView /></ViewGate>}
        {currentView === 'ALL_REVIEWS' && selectedEPal && <ViewGate><AllReviewsView /></ViewGate>}
        {currentView === 'IM' && <ViewGate><ImView /></ViewGate>}
        {currentView === 'CONTACTS' && <ViewGate><ContactsView /></ViewGate>}
        {currentView === 'IM_DETAIL' && selectedEPal && <ViewGate><ImDetailView /></ViewGate>}
        {currentView === 'ME' && <ViewGate><MeView /></ViewGate>}
        {currentView === 'MY_ORDERS' && <ViewGate><MyOrdersView /></ViewGate>}
        {currentView === 'RECHARGE' && <ViewGate><RechargeRouteView /></ViewGate>}
        {currentView === 'WITHDRAW' && <ViewGate><WithdrawView /></ViewGate>}
        {currentView === 'APPLY_PLAYER' && <ViewGate><ApplyPlayerView /></ViewGate>}
        {currentView === 'APPLY_PLAYER_CATEGORY' && <ViewGate><ApplyPlayerCategoryView /></ViewGate>}
        {currentView === 'APPLY_PLAYER_DETAILS' && <ViewGate><ApplyPlayerDetailsView /></ViewGate>}
        {currentView === 'SETTINGS' && <ViewGate><SettingsView /></ViewGate>}
        {currentView === 'SETTINGS_EDIT_PROFILE' && <ViewGate><SettingsEditProfileView /></ViewGate>}
        {currentView === 'SETTINGS_CHANGE_PASSWORD' && <ViewGate><SettingsChangePasswordView /></ViewGate>}
        {currentView === 'SETTINGS_LINKED_ACCOUNTS' && <ViewGate><SettingsLinkedAccountsView /></ViewGate>}
        {currentView === 'SETTINGS_LANGUAGE' && <ViewGate><SettingsLanguageView /></ViewGate>}
        {currentView === 'SETTINGS_PRIVACY' && <ViewGate><SettingsPrivacyView /></ViewGate>}
        {currentView === 'SETTINGS_TERMS' && <ViewGate><SettingsTermsView /></ViewGate>}
        {currentView === 'WALLET' && <ViewGate><WalletRouteView /></ViewGate>}
        {currentView === 'PLAYER_PROFILE_EDIT' && <ViewGate><PlayerProfileEditView /></ViewGate>}
        {currentView === 'NOTIFICATIONS' && <ViewGate><NotificationsView /></ViewGate>}
        {currentView === 'ORDER_CONFIRM' && selectedEPal && selectedVariant && <ViewGate><OrderConfirmView /></ViewGate>}
      </AnimatePresence>
      <ViewOverlays />
    </>
  );
}
