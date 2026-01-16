import React from 'react'

const AccountDetailsCard = ({
  user,
  message,
  error,
  isEditingUsername,
  setIsEditingUsername,
  newUsername,
  setNewUsername,
  handleUpdateUsername,
  isEditingEmail,
  setIsEditingEmail,
  newEmail,
  setNewEmail,
  handleUpdateEmail,
  isEditingPassword,
  setIsEditingPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  currentPassword,
  setCurrentPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleUpdatePassword,
  isEditingProfile,
  setIsEditingProfile,
  age,
  setAge,
  state,
  setState,
  country,
  setCountry,
  phoneNumber,
  setPhoneNumber,
  countries,
  handleUpdateProfile
}) => {
  return (
    <div className='profile-card bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-blue-200 h-fit'>
      <h2 className='text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2'>
        <i className="ri-user-settings-line"></i>
        Account Details
      </h2>
  
      {message && (
        <div className='bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-2'>
          <i className="ri-checkbox-circle-line text-xl"></i>
          <p className="text-sm font-semibold">{message}</p>
        </div>
      )}
      
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2'>
          <i className="ri-error-warning-line text-xl"></i>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}
      
      {/* Username Section */}
      <div className='bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-200'>
        <div className='flex items-center justify-between mb-2'>
          <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Username</label>
          {!isEditingUsername && (
            <button 
              onClick={() => setIsEditingUsername(true)}
              className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1'
            >
              <i className="ri-edit-line"></i> Edit
            </button>
          )}
        </div>
        {!isEditingUsername ? (
          <p className='text-2xl font-bold text-gray-800 break-words overflow-wrap-anywhere'>{user.username}</p>
        ) : (
          <div className='space-y-3'>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
            />
            <div className='flex gap-2'>
              <button 
                onClick={handleUpdateUsername}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'
              >
                Update
              </button>
              <button 
                onClick={() => {
                  setIsEditingUsername(false)
                  setNewUsername('')
                }}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Section */}
      <div className='bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-200'>
        <div className='flex items-center justify-between mb-2'>
          <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Email</label>
          {!isEditingEmail && (
            <button 
              onClick={() => setIsEditingEmail(true)}
              className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1'
            >
              <i className="ri-edit-line"></i> Edit
            </button>
          )}
        </div>
        {!isEditingEmail ? (
          <p className='text-2xl font-bold text-gray-800 break-all overflow-hidden'>{user.email}</p>
        ) : (
          <div className='space-y-3'>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
            />
            <div className='flex gap-2'>
              <button 
                onClick={handleUpdateEmail}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'
              >
                Update
              </button>
              <button 
                onClick={() => {
                  setIsEditingEmail(false)
                  setNewEmail('')
                }}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className='bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-200'>
        <div className='flex items-center justify-between mb-2'>
          <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Password</label>
          {!isEditingPassword && (
            <button 
              onClick={() => setIsEditingPassword(true)}
              className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1'
            >
              <i className="ri-edit-line"></i> Edit
            </button>
          )}
        </div>
        {!isEditingPassword ? (
          <p className='text-2xl font-bold text-gray-800'>••••••••</p>
        ) : (
          <div className='space-y-3'>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className='w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`${showCurrentPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
              </button>
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className='w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`${showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className='w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
              </button>
            </div>
            <div className='flex gap-2'>
              <button 
                onClick={handleUpdatePassword}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'
              >
                Update Password
              </button>
              <button 
                onClick={() => {
                  setIsEditingPassword(false)
                  setNewPassword('')
                  setConfirmPassword('')
                  setCurrentPassword('')
                }}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Profile Details Section */}
      <div className='bg-blue-50 rounded-2xl p-6 border border-blue-200 mt-4'>
        <div className='flex items-center justify-between mb-2'>
          <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Profile Details</label>
          {!isEditingProfile && (
            <button 
              onClick={() => {
                setIsEditingProfile(true)
                setAge(user.age || '')
                setState(user.state || '')
                setCountry(user.country || '')
                setPhoneNumber(user.phoneNumber || '')
              }}
              className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1'
            >
              <i className="ri-edit-line"></i> Edit
            </button>
          )}
        </div>
        {!isEditingProfile ? (
          <div className='space-y-3'>
            <div>
              <p className='text-xs text-gray-500 mb-1'>Age</p>
              <p className='text-lg font-bold text-gray-800'>{user.age || 'Not set'}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>State</p>
              <p className='text-lg font-bold text-gray-800'>{user.state || 'Not set'}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>Country</p>
              <p className='text-lg font-bold text-gray-800'>
                {user.country ? `${countries.find(c => c.name === user.country)?.flag || ''} ${user.country}` : 'Not set'}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>Phone Number</p>
              <p className='text-lg font-bold text-gray-800'>{user.phoneNumber || 'Not set'}</p>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            <div>
              <label className='block text-xs text-gray-600 mb-1 font-semibold'>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="120"
                className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-600 mb-1 font-semibold'>State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter your state"
                className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-600 mb-1 font-semibold'>Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none bg-white'
              >
                <option value="">Select your country</option>
                {countries.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-xs text-gray-600 mb-1 font-semibold'>
                Phone Number <span className='text-red-600'>*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
                className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
              />
            </div>
            <div className='flex gap-2 pt-2'>
              <button 
                onClick={handleUpdateProfile}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'
              >
                Save
              </button>
              <button 
                onClick={() => {
                  setIsEditingProfile(false)
                  setAge('')
                  setState('')
                  setCountry('')
                  setPhoneNumber('')
                }}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountDetailsCard
