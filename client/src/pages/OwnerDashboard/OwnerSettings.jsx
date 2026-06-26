import { Bell, Building2, CreditCard, Edit, ExternalLink, Globe, MapPin, SaveIcon, Shield, UploadIcon, User, X } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'


const InputField = ({ label, value, onChange, disabled, type = 'text', placeholder = '' }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${disabled
          ? 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
          : 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-600'}`}
    />
  </div>
)

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="text-base font-semibold text-white">{title}</h2>
    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
  </div>
)

const Divider = () => <div className="border-t border-slate-800 my-6" />

const FooterActions = ({ isEditing, isSaving, onEdit, onCancel, onSave, editLabel = 'Edit Profile' }) => (
  <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800">
    {!isEditing ? (
      <button onClick={onEdit}
        className="flex items-center gap-2 text-sm text-blue-400 border border-blue-500/30 px-5 py-2.5 rounded-xl hover:bg-blue-500/10 transition-all cursor-pointer">
        <Edit className="w-4 h-4" /> {editLabel}
      </button>
    ) : (
      <>
        <button onClick={onCancel}
          className="flex items-center gap-2 text-sm text-slate-400 border border-slate-700 px-5 py-2.5 rounded-xl hover:border-slate-600 hover:text-white transition-all cursor-pointer">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button onClick={onSave}
          className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors cursor-pointer" disabled={isSaving}>
          <SaveIcon className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </>
    )}
  </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const OwnerSettings = () => {

  const { token, user, setUser } = useContext(AppContext)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    companyName: user?.companyName || '',
    email: user?.email || '',
    contactNumber: user?.contactNumber || '',
    industry: user?.industry || '',
    companySize: user?.companySize || '',
    location: user?.location || '',
    bio: user?.bio || '',
    hiringFor: user?.hiringFor || user?.hiringfor || [],
    companyWebsite: user?.companyWebsite || '',
    companyLinkedin: user?.companyLinkedin || '',
    companyTwitter: user?.companyTwitter || '',
    companyLogo: user?.companyLogo || '',
  });

  const [tempProfileData, setTempProfileData] = useState(profileData)
  const [tempProfilePhoto, setTempProfilePhoto] = useState(profilePhoto)

  const [selectedFile, setSelectedFile] = useState(null);

  // ── Security / Change Password state ─────────────────────────────────────
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [serverOtp, setServerOtp] = useState('')
  const [securityLoading, setSecurityLoading] = useState(false)

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('File size must be less than 2MB'); return }
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) { alert('Only JPG, PNG, or GIF files are allowed'); return }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onloadend = () => setTempProfilePhoto(reader.result)
    reader.readAsDataURL(file)
  }

  const handleUpdateProfile = () => { setTempProfileData(profileData); setTempProfilePhoto(profilePhoto); setSelectedFile(null); setIsEditingProfile(true) }
  const handleCancelEdit = () => { setTempProfileData(profileData); setIsEditingProfile(false); setTempProfilePhoto(profilePhoto); setSelectedFile(null); }

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', tempProfileData.name);
      formData.append('companyName', tempProfileData.companyName);
      formData.append('email', tempProfileData.email);
      formData.append('contactNumber', tempProfileData.contactNumber);
      formData.append('industry', tempProfileData.industry);
      formData.append('companySize', tempProfileData.companySize);
      formData.append('location', tempProfileData.location);
      formData.append('bio', tempProfileData.bio);
      formData.append('hiringFor', JSON.stringify(tempProfileData.hiringFor));
      formData.append('companyWebsite', tempProfileData.companyWebsite);
      formData.append('companyLinkedin', tempProfileData.companyLinkedin);
      formData.append('companyTwitter', tempProfileData.companyTwitter);

      if (selectedFile) {
        formData.append('companyLogo', selectedFile);
      }

      const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/recruiter/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || 'Failed to update profile');
        return;
      } else {
        const updatedUser = data.recruiter;

        const mappedProfile = {
          name: updatedUser.name || '',
          companyName: updatedUser.companyName || '',
          email: updatedUser.email || '',
          contactNumber: updatedUser.contactNumber || '',
          industry: updatedUser.industry || '',
          companySize: updatedUser.companySize || '',
          location: updatedUser.location || '',
          bio: updatedUser.bio || '',
          hiringFor: updatedUser.hiringFor || updatedUser.hiringfor || [],
          companyWebsite: updatedUser.companyWebsite || '',
          companyLinkedin: updatedUser.companyLinkedin || '',
          companyTwitter: updatedUser.companyTwitter || '',
          companyLogo: updatedUser.companyLogo || '',
        };
        setProfileData(mappedProfile);
        setTempProfileData(mappedProfile);
        setProfilePhoto(updatedUser.companyLogo || null);
        setTempProfilePhoto(updatedUser.companyLogo || null);
        setUser(updatedUser);

        toast.success('Profile updated successfully');
        setIsEditingProfile(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  }


  const currentProfile = isEditingProfile ? tempProfileData : profileData
  const currentPhoto = isEditingProfile ? tempProfilePhoto : profilePhoto

  useEffect(() => {
    if (!user) return;

    const mappedProfile = {
      name: user.name || '',
      companyName: user.companyName || '',
      email: user.email || '',
      contactNumber: user.contactNumber || '',
      industry: user.industry || '',
      companySize: user.companySize || '',
      location: user.location || '',
      bio: user.bio || '',
      companyWebsite: user.companyWebsite || '',
      companyLinkedin: user.companyLinkedin || '',
      companyTwitter: user.companyTwitter || '',
      companyLogo: user.companyLogo || '',
      hiringFor: user.hiringFor || user.hiringfor || [],
    };
    setProfileData(mappedProfile);
    setTempProfileData(mappedProfile);
    setProfilePhoto(user.companyLogo || null);
    setTempProfilePhoto(user.companyLogo || null);
  }, [user])

  // ── Security handlers ─────────────────────────────────────────────────
  const handleChangePasswordClick = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setPasswordMismatch(false)
    try {
      setSecurityLoading(true)
      const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/recruiter/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, name: user?.name })
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.message || 'Failed to send OTP'); return }
      setServerOtp(data.otp)
      setOtpSent(true)
      toast.success(`OTP sent to ${user?.email}`)
    } catch { toast.error('Failed to send OTP') }
    finally { setSecurityLoading(false) }
  }

  const handleConfirmNewPassword = async () => {
    if (otpValue.trim() !== String(serverOtp).trim()) {
      toast.error('Incorrect OTP. Please try again.')
      return
    }
    try {
      setSecurityLoading(true)
      const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/recruiter/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newPassword })
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.message || 'Failed to change password'); return }
      toast.success('Password changed successfully!')
      setIsChangingPassword(false); setNewPassword(''); setConfirmPassword('')
      setOtpSent(false); setOtpValue(''); setServerOtp(''); setPasswordMismatch(false)
    } catch { toast.error('Failed to change password') }
    finally { setSecurityLoading(false) }
  }

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false); setNewPassword(''); setConfirmPassword('')
    setOtpSent(false); setOtpValue(''); setServerOtp(''); setPasswordMismatch(false)
  }

  // ── Tab renderers ─────────────────────────────────────────────────────────
  const renderProfileTab = () => (
    <div>
      {/* Company logo + upload */}
      <div className="flex items-center gap-5 mb-6">
        {currentPhoto
          ? <img src={currentPhoto} alt="Company" className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700" />
          : <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {currentProfile.companyName.slice(0, 2).toUpperCase()}
          </div>
        }
        <div>
          <input type="file" ref={fileInputRef} accept="image/jpeg,image/jpg,image/png,image/gif" onChange={handlePhotoUpload} className="hidden" />
          <button
            disabled={!isEditingProfile}
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl border transition-all mb-2
              ${isEditingProfile
                ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10 cursor-pointer'
                : 'border-slate-700/50 text-slate-600 cursor-not-allowed opacity-50'}`}
          >
            <UploadIcon className="w-3.5 h-3.5" /> Upload Logo
          </button>
          <p className="text-xs text-slate-600">JPG, PNG or GIF · Max 2MB</p>
        </div>
      </div>

      <Divider />
      <SectionTitle title="Company Information" subtitle="Basic details about your organization" />

      <div className="grid grid-cols-2 gap-4 mb-2">
        <InputField label="Company Name" value={currentProfile.companyName} onChange={e => setTempProfileData(p => ({ ...p, companyName: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Contact Person" value={currentProfile.name} onChange={e => setTempProfileData(p => ({ ...p, name: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Email" value={currentProfile.email} onChange={e => setTempProfileData(p => ({ ...p, email: e.target.value }))} disabled={!isEditingProfile} type="email" />
        <InputField label="Phone Number" value={currentProfile.contactNumber} onChange={e => setTempProfileData(p => ({ ...p, contactNumber: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Industry" value={currentProfile.industry} onChange={e => setTempProfileData(p => ({ ...p, industry: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Company Size" value={currentProfile.companySize} onChange={e => setTempProfileData(p => ({ ...p, companySize: e.target.value }))} disabled={!isEditingProfile} />
        <div className="col-span-2">
          <InputField label="Location" value={currentProfile.location} onChange={e => setTempProfileData(p => ({ ...p, location: e.target.value }))} disabled={!isEditingProfile} />
        </div>

        <div className="col-span-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {currentProfile.hiringFor.map((hiring, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-xl text-xs font-medium">
                {hiring}
                {isEditingProfile && (
                  <button onClick={() => setTempProfileData(p => ({ ...p, hiringFor: p.hiringFor.filter((_, idx) => idx !== i) }))} className="hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          <input
            disabled={!isEditingProfile}
            type="text"
            placeholder="Add a new hiring focus (press Enter)"
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const newHiring = e.target.value.trim();
                if (newHiring) {
                  setTempProfileData(p => ({ ...p, hiringFor: [...p.hiringFor, newHiring] }));
                  e.target.value = '';
                }
              }
            }}
          />

        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Company Bio</label>
          <textarea
            rows={4}
            value={currentProfile.bio}
            onChange={e => setTempProfileData(p => ({ ...p, bio: e.target.value }))}
            disabled={!isEditingProfile}
            className={`w-full px-4 py-2.5 rounded-xl text-sm border resize-none transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${!isEditingProfile
                ? 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-600'}`}
          />
        </div>
      </div>

      <Divider />
      <SectionTitle title="Professional Links" subtitle="Your company's online presence" />

      <div className="flex flex-col gap-4">
        <InputField label="Company Website" value={currentProfile.companyWebsite} onChange={e => setTempProfileData(p => ({ ...p, companyWebsite: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="LinkedIn" value={currentProfile.companyLinkedin} onChange={e => setTempProfileData(p => ({ ...p, companyLinkedin: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Twitter" value={currentProfile.companyTwitter} onChange={e => setTempProfileData(p => ({ ...p, companyTwitter: e.target.value }))} disabled={!isEditingProfile} />
      </div>

      <FooterActions
        isEditing={isEditingProfile}
        isSaving={loading}
        onEdit={handleUpdateProfile}
        onCancel={handleCancelEdit}
        onSave={handleSaveChanges}
        editLabel="Edit Profile"
      />
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4">
        <Bell className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-white font-semibold mb-2">Notification Settings</h3>
      <p className="text-slate-500 text-sm">Email and push notification preferences — coming soon.</p>
    </div>
  )

  const renderSecurityTab = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Change Password</h2>
          <p className="text-xs text-slate-500 mt-0.5">Update your account password with OTP verification</p>
        </div>
      </div>

      <div className="border-t border-slate-800 my-6" />

      <div className="flex flex-col gap-4 max-w-md">
        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">New Password</label>
          <input
            id="owner-security-new-password"
            type="password"
            value={newPassword}
            onChange={e => { setNewPassword(e.target.value); setPasswordMismatch(false) }}
            disabled={!isChangingPassword || otpSent}
            placeholder={isChangingPassword ? 'Enter new password' : '••••••••'}
            className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${(!isChangingPassword || otpSent)
                ? 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-600'}`}
          />
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Confirm New Password</label>
          <input
            id="owner-security-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setPasswordMismatch(false) }}
            disabled={!isChangingPassword || otpSent}
            placeholder={isChangingPassword ? 'Confirm new password' : '••••••••'}
            className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${(!isChangingPassword || otpSent)
                ? 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
                : passwordMismatch
                  ? 'bg-slate-800 border-red-500/60 text-slate-200 placeholder-slate-600'
                  : 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-600'}`}
          />
          {passwordMismatch && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
              <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500/20 text-red-400 text-center font-bold">!</span>
              Passwords don't match
            </p>
          )}
        </div>

        {/* OTP field — shown after OTP is sent */}
        {otpSent && (
          <div className="flex flex-col gap-1.5 mt-2 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <label className="text-xs font-medium text-blue-400 uppercase tracking-wide">Enter OTP</label>
            <p className="text-xs text-slate-400 mb-2">A 6-digit code was sent to <span className="text-white font-medium">{user?.email}</span></p>
            <input
              id="owner-security-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpValue}
              onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 rounded-xl text-lg font-mono tracking-[0.5em] text-center border bg-slate-800 border-blue-500/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-800">
        {!isChangingPassword ? (
          <button
            id="owner-security-change-password-btn"
            onClick={() => setIsChangingPassword(true)}
            className="flex items-center gap-2 text-sm text-blue-400 border border-blue-500/30 px-5 py-2.5 rounded-xl hover:bg-blue-500/10 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4" /> Change Password
          </button>
        ) : (
          <>
            <button
              id="owner-security-cancel-btn"
              onClick={handleCancelPasswordChange}
              disabled={securityLoading}
              className="flex items-center gap-2 text-sm text-slate-400 border border-slate-700 px-5 py-2.5 rounded-xl hover:border-slate-600 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" /> Cancel
            </button>

            {!otpSent ? (
              <button
                id="owner-security-send-otp-btn"
                onClick={handleChangePasswordClick}
                disabled={securityLoading || !newPassword || !confirmPassword}
                className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {securityLoading ? 'Sending OTP...' : 'Change Password'}
              </button>
            ) : (
              <button
                id="owner-security-confirm-btn"
                onClick={handleConfirmNewPassword}
                disabled={securityLoading || otpValue.length !== 6}
                className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SaveIcon className="w-4 h-4" />
                {securityLoading ? 'Updating...' : 'Confirm New Password'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )

  const renderAccountTab = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4">
        <CreditCard className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-white font-semibold mb-2">Account Settings</h3>
      <p className="text-slate-500 text-sm">Billing, subscription, and account management — coming soon.</p>
    </div>
  )


  return (
    <div className="min-h-screen">

      {/* Page header */}
      <div className="mb-6">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Preferences</p>
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-4 gap-5 items-start">

        {/* ── Sidebar tabs ── */}
        <aside className="col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sticky top-6">
            {/* Company mini profile */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {profileData.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{profileData.companyName}</p>
                <p className="text-xs text-slate-500 truncate">{profileData.name}</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 py-2">Menu</p>
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5 last:mb-0 cursor-pointer
                    ${active ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Quick info card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mt-4">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">Company Info</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate">{profileData.industry}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate">{profileData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <a href={profileData.companyWebsite} target="_blank" rel="noopener noreferrer"
                  className="truncate text-blue-400 hover:underline">{profileData.companyWebsite || 'Not provided'}</a>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Content panel ── */}
        <main className="col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'account' && renderAccountTab()}
        </main>

      </div>
    </div>
  )
}

export default OwnerSettings