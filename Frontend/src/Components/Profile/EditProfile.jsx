import { useState } from 'react';
import { updateUserAvatar } from '../../Services/Auth.service';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', avatar);
    
    try {
      const response = await updateUserAvatar(formData);
      if (response) {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Decorative ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative flex-1 flex items-center justify-center py-12 px-6">
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">
          
          <h2 className="text-3xl font-extrabold font-outfit mb-2 text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Update Avatar
          </h2>
          <p className="text-slate-400 font-outfit text-sm text-center mb-8">Personalize your coding identity</p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center mb-8 w-full">
              {preview ? (
                <div className="relative group mb-6">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-500 opacity-30 blur group-hover:opacity-60 transition duration-500"></div>
                  <img 
                    src={preview} 
                    alt="Avatar Preview" 
                    className="relative h-48 w-48 rounded-3xl object-cover shadow-2xl border border-slate-800"
                  />
                </div>
              ) : (
                <div className="h-48 w-48 rounded-3xl bg-slate-950/60 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center mb-6 text-center p-4">
                  <span className="text-3xl mb-2">👤</span>
                  <span className="text-slate-500 font-outfit text-sm font-semibold">No Image Selected</span>
                </div>
              )}

              <label 
                htmlFor="avatar" 
                className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/60 font-semibold font-outfit py-2.5 px-6 rounded-2xl cursor-pointer shadow-md transition duration-300 transform hover:-translate-y-0.5 inline-block text-center"
              >
                Choose Photo
              </label>
              
              <input 
                type="file" 
                id="avatar" 
                className="hidden" 
                onChange={handleAvatarChange} 
                accept="image/*"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !avatar}
              className={`w-full font-outfit font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg ${
                loading || !avatar
                  ? 'bg-slate-800 text-slate-500 border border-slate-900 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-500/10 hover:shadow-orange-500/20'
              }`}
            >
              {loading ? 'Saving Changes...' : 'Update Avatar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
