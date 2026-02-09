"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  BookOpen,
  ArrowLeft,
  User,
  Phone,
  Globe,
  Globe2,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  Settings,
} from "lucide-react";
import {
  updateProfile,
  changePassword,
  toggleProfilePrivacy,
  updateCalendarDisplayMode,
  type ProfileData,
} from "@/app/profile/actions";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/validations/profile";
import { COUNTRIES } from "@/lib/constants/countries";

type Section = "personal" | "privacy" | "password" | "layout";

const SIDEBAR_ITEMS: {
  key: Section;
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}[] = [
  { key: "personal", label: "Personal Information", icon: User },
  { key: "privacy", label: "Profile Privacy", icon: Globe2 },
  { key: "password", label: "Change Password", icon: Lock },
  { key: "layout", label: "Layout Settings", icon: Settings },
];

interface ProfileClientProps {
  initialProfile: ProfileData;
}

export function ProfileClient({ initialProfile }: ProfileClientProps) {
  const { update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();
  const [activeSection, setActiveSection] = useState<Section>("personal");

  const [profile, setProfile] = useState({
    firstName: initialProfile.firstName,
    lastName: initialProfile.lastName,
    username: initialProfile.username,
    phoneNumber: initialProfile.phoneNumber,
    country: initialProfile.country,
    gender: initialProfile.gender,
    birthday: initialProfile.birthday,
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>(
    {}
  );

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Record<string, string[]>
  >({});
  const [isProfilePublic, setIsProfilePublic] = useState(
    initialProfile.isProfilePublic
  );
  const [calendarDisplayMode, setCalendarDisplayMode] = useState<
    "DOTS_ONLY" | "REFERENCES_WITH_DOTS" | "REFERENCES_ONLY"
  >(initialProfile.calendarDisplayMode);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSaveProfile = () => {
    setProfileErrors({});

    const parsed = updateProfileSchema.safeParse(profile);
    if (!parsed.success) {
      setProfileErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
      return;
    }

    startTransition(async () => {
      const result = await updateProfile(parsed.data);
      if (result.error) {
        if (result.fieldErrors) {
          setProfileErrors(result.fieldErrors as Record<string, string[]>);
        } else {
          toast.error(result.error);
        }
        return;
      }
      toast.success("Profile updated successfully");
      await updateSession({
        name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      });
    });
  };

  const handleChangePassword = () => {
    setPasswordErrors({});

    const parsed = changePasswordSchema.safeParse(passwords);
    if (!parsed.success) {
      setPasswordErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
      return;
    }

    startTransition(async () => {
      const result = await changePassword(parsed.data);
      if (result.error) {
        if (result.fieldErrors) {
          setPasswordErrors(result.fieldErrors as Record<string, string[]>);
        } else {
          toast.error(result.error);
        }
        return;
      }
      toast.success("Password changed successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    });
  };

  const handleTogglePrivacy = () => {
    const newValue = !isProfilePublic;
    setIsProfilePublic(newValue);

    startTransition(async () => {
      const result = await toggleProfilePrivacy();
      if (result.error) {
        setIsProfilePublic(!newValue);
        toast.error(result.error);
      } else {
        toast.success(
          newValue ? "Profile is now public" : "Profile is now private"
        );
      }
    });
  };

  const handleCalendarDisplayModeChange = (
    mode: "DOTS_ONLY" | "REFERENCES_WITH_DOTS" | "REFERENCES_ONLY"
  ) => {
    setCalendarDisplayMode(mode);

    startTransition(async () => {
      const result = await updateCalendarDisplayMode(mode);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Calendar display updated");
      }
    });
  };

  const memberSince = new Date(initialProfile.createdAt).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Sola Scriptura
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-1">
            Profile Settings
          </h1>
          <p className="text-stone-500">
            Member since {memberSince} &middot; {initialProfile.email}
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden mb-6 overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                    ${
                      isActive
                        ? "bg-stone-900 text-white shadow-lg"
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                    }
                  `}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-4 border border-stone-100 sticky top-24">
              <nav className="space-y-1">
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveSection(item.key)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left
                        ${
                          isActive
                            ? "bg-stone-900 text-white shadow-lg"
                            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                        }
                      `}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content area */}
          <div className="lg:col-span-9">
            {activeSection === "personal" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                  Personal Information
                </h2>

                <div className="space-y-5">
                  {/* First + Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="First name"
                      name="firstName"
                      icon={User}
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      errors={profileErrors.firstName}
                    />
                    <InputField
                      label="Last name"
                      name="lastName"
                      icon={User}
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      errors={profileErrors.lastName}
                    />
                  </div>

                  {/* Username */}
                  <InputField
                    label="Username"
                    name="username"
                    icon={User}
                    value={profile.username}
                    onChange={handleProfileChange}
                    errors={profileErrors.username}
                    placeholder="johndoe (optional)"
                  />

                  {/* Birthday */}
                  <InputField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    icon={Calendar}
                    value={profile.birthday}
                    onChange={handleProfileChange}
                    errors={profileErrors.birthday}
                  />

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                    {profileErrors.gender && (
                      <p className="text-red-500 text-xs mt-1">
                        {profileErrors.gender[0]}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <InputField
                    label="Phone number"
                    name="phoneNumber"
                    type="tel"
                    icon={Phone}
                    value={profile.phoneNumber}
                    onChange={handleProfileChange}
                    errors={profileErrors.phoneNumber}
                    placeholder="+1 (555) 123-4567 (optional)"
                  />

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Country
                    </label>
                    <div className="relative">
                      <Globe
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                      <select
                        name="country"
                        value={profile.country}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {profileErrors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {profileErrors.country[0]}
                      </p>
                    )}
                  </div>

                  {/* Save */}
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                  Profile Privacy
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe2 size={20} className="text-stone-600" />
                        <h3 className="font-medium text-stone-900">Public Profile</h3>
                      </div>
                      <p className="text-sm text-stone-600">
                        {isProfilePublic
                          ? `Your profile is visible at /u/${profile.username || "your-username"}. Anyone can see your reading stats and recent entries.`
                          : "Your profile is private. Only you can see your reading activity."}
                      </p>
                      {profile.username && isProfilePublic && (
                        <Link
                          href={`/u/${profile.username}`}
                          target="_blank"
                          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2 inline-block"
                        >
                          View your public profile &rarr;
                        </Link>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleTogglePrivacy}
                      disabled={isPending || !profile.username}
                      className={`
                        relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors
                        ${isProfilePublic ? "bg-emerald-500" : "bg-stone-300"}
                        ${isPending || !profile.username ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform
                          ${isProfilePublic ? "translate-x-7" : "translate-x-1"}
                        `}
                      />
                    </button>
                  </div>

                  {!profile.username && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm text-amber-800">
                        You need to set a username above before you can enable your
                        public profile.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === "password" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                  Change Password
                </h2>

                <div className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Current password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.currentPassword[0]}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      New password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Min 8 characters"
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.newPassword[0]}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmNewPassword"
                        value={passwords.confirmNewPassword}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmNewPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.confirmNewPassword[0]}
                      </p>
                    )}
                  </div>

                  {/* Change Password Button */}
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Lock size={20} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "layout" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">
                  Layout Settings
                </h2>

                <div className="space-y-6">
                  {/* Calendar Display Mode */}
                  <div>
                    <h3 className="font-medium text-stone-900 mb-3">
                      Calendar Display
                    </h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Choose how reading entries are displayed on your calendar.
                    </p>
                    <div className="space-y-3">
                      {/* References with Dots (Default) */}
                      <button
                        type="button"
                        onClick={() =>
                          handleCalendarDisplayModeChange("REFERENCES_WITH_DOTS")
                        }
                        disabled={isPending}
                        className={`
                          w-full text-left p-4 rounded-xl border-2 transition-all
                          ${
                            calendarDisplayMode === "REFERENCES_WITH_DOTS"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-stone-200 hover:border-stone-300"
                          }
                          ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-stone-900 mb-1">
                              References with Dots
                              <span className="ml-2 text-xs text-emerald-600 font-semibold">
                                (Default)
                              </span>
                            </div>
                            <p className="text-sm text-stone-600">
                              Show abbreviated verse references (e.g., &quot;Rev 2:1-10&quot;) with
                              indicator dots below
                            </p>
                          </div>
                          {calendarDisplayMode === "REFERENCES_WITH_DOTS" && (
                            <Check size={20} className="text-emerald-600 ml-4 flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      {/* Dots Only */}
                      <button
                        type="button"
                        onClick={() => handleCalendarDisplayModeChange("DOTS_ONLY")}
                        disabled={isPending}
                        className={`
                          w-full text-left p-4 rounded-xl border-2 transition-all
                          ${
                            calendarDisplayMode === "DOTS_ONLY"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-stone-200 hover:border-stone-300"
                          }
                          ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-stone-900 mb-1">
                              Dots Only
                            </div>
                            <p className="text-sm text-stone-600">
                              Show only indicator dots without verse references for a cleaner
                              look
                            </p>
                          </div>
                          {calendarDisplayMode === "DOTS_ONLY" && (
                            <Check size={20} className="text-emerald-600 ml-4 flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      {/* References Only */}
                      <button
                        type="button"
                        onClick={() =>
                          handleCalendarDisplayModeChange("REFERENCES_ONLY")
                        }
                        disabled={isPending}
                        className={`
                          w-full text-left p-4 rounded-xl border-2 transition-all
                          ${
                            calendarDisplayMode === "REFERENCES_ONLY"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-stone-200 hover:border-stone-300"
                          }
                          ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-stone-900 mb-1">
                              References Only
                            </div>
                            <p className="text-sm text-stone-600">
                              Show verse references without indicator dots for maximum detail
                            </p>
                          </div>
                          {calendarDisplayMode === "REFERENCES_ONLY" && (
                            <Check size={20} className="text-emerald-600 ml-4 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Reusable Input Field ---

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string[];
  placeholder?: string;
}

function InputField({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  onChange,
  errors,
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
        />
      </div>
      {errors && <p className="text-red-500 text-xs mt-1">{errors[0]}</p>}
    </div>
  );
}
