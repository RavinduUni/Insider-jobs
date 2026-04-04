import { Bell, Building2, CreditCard, Edit, ExternalLink, Globe, MapPin, SaveIcon, Shield, UploadIcon, User, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

// ── Shared primitives (outside parent to avoid remount on keystroke) ───────────
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

const FooterActions = ({ isEditing, onEdit, onCancel, onSave, editLabel = 'Edit Profile' }) => (
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
          className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
          <SaveIcon className="w-4 h-4" /> Save Changes
        </button>
      </>
    )}
  </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const OwnerSettings = () => {

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const fileInputRef = useRef(null)

  const [profileData, setProfileData] = useState({
    companyName: 'TechStart Inc',
    contactPerson: 'John Williams',
    email: 'john@techstart.com',
    phone: '+1 (555) 987-6543',
    industry: 'Software Development',
    companySize: '50-200 employees',
    location: 'San Francisco, CA',
    bio: 'TechStart Inc is a leading software development company specializing in innovative solutions for startups and enterprises. We are committed to delivering high-quality projects on time.',
    interests: ['Web Development', 'Mobile Apps', 'UI/UX Design', 'AI/ML', 'Cloud Solutions'],
    website: 'https://techstart.com',
    linkedin: 'https://linkedin.com/company/techstart',
    twitter: 'https://twitter.com/techstart',
  })

  const [tempProfileData, setTempProfileData] = useState(profileData)
  const [tempProfilePhoto, setTempProfilePhoto] = useState(profilePhoto)

  // ── Handlers (all original logic preserved) ──────────────────────────────
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('File size must be less than 2MB'); return }
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) { alert('Only JPG, PNG, or GIF files are allowed'); return }
    const reader = new FileReader()
    reader.onloadend = () => setTempProfilePhoto(reader.result)
    reader.readAsDataURL(file)
  }

  const handleUpdateProfile = () => { setTempProfileData(profileData); setIsEditingProfile(true) }
  const handleSaveChanges = () => { setProfileData(tempProfileData); setProfilePhoto(tempProfilePhoto); setIsEditingProfile(false) }
  const handleCancelEdit = () => { setTempProfileData(profileData); setIsEditingProfile(false); setTempProfilePhoto(profilePhoto) }

  const currentProfile = isEditingProfile ? tempProfileData : profileData
  const currentPhoto = isEditingProfile ? tempProfilePhoto : profilePhoto

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
        <InputField label="Contact Person" value={currentProfile.contactPerson} onChange={e => setTempProfileData(p => ({ ...p, contactPerson: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Email" value={currentProfile.email} onChange={e => setTempProfileData(p => ({ ...p, email: e.target.value }))} disabled={!isEditingProfile} type="email" />
        <InputField label="Phone Number" value={currentProfile.phone} onChange={e => setTempProfileData(p => ({ ...p, phone: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Industry" value={currentProfile.industry} onChange={e => setTempProfileData(p => ({ ...p, industry: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Company Size" value={currentProfile.companySize} onChange={e => setTempProfileData(p => ({ ...p, companySize: e.target.value }))} disabled={!isEditingProfile} />
        <div className="col-span-2">
          <InputField label="Location" value={currentProfile.location} onChange={e => setTempProfileData(p => ({ ...p, location: e.target.value }))} disabled={!isEditingProfile} />
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
        <InputField label="Company Website" value={currentProfile.website} onChange={e => setTempProfileData(p => ({ ...p, website: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="LinkedIn" value={currentProfile.linkedin} onChange={e => setTempProfileData(p => ({ ...p, linkedin: e.target.value }))} disabled={!isEditingProfile} />
        <InputField label="Twitter" value={currentProfile.twitter} onChange={e => setTempProfileData(p => ({ ...p, twitter: e.target.value }))} disabled={!isEditingProfile} />
      </div>

      <FooterActions
        isEditing={isEditingProfile}
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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4">
        <Shield className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-white font-semibold mb-2">Security Settings</h3>
      <p className="text-slate-500 text-sm">Password, two-factor auth, and active sessions — coming soon.</p>
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

  // ── Render ────────────────────────────────────────────────────────────────
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
                <p className="text-xs text-slate-500 truncate">Project Owner</p>
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
                <a href={profileData.website} target="_blank" rel="noopener noreferrer"
                  className="truncate text-blue-400 hover:underline">{profileData.website.replace('https://', '')}</a>
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