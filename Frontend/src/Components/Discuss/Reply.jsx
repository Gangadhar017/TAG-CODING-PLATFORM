import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../Services/Auth.service';
import { toast } from 'react-hot-toast';
import { createTweetService } from '../../Services/Tweet.service';

function Reply({ replyOf = '', onReplySuccess }) {
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleTweetCreate = () => {
        if (!isLoggedIn()) {
            toast.error('Login to Tweet');
            navigate('/login');
            return;
        }
        if (!content) {
            toast.error('Content Required');
            return;
        }
        const helper = async () => {
            const response = await createTweetService(content, replyOf, file);
            if (response) {
                toast.success(replyOf === '' ? 'Tweet Created' : 'Reply Sent');
                setContent('');
                setFile(null);
                onReplySuccess(); 
                navigate('/discuss');
            }
        };

        helper();
    };

    return (
        <div className="w-full flex flex-col space-y-4">
            <div className="w-full">
                <textarea
                    placeholder={replyOf === '' ? "What's on your mind? Share your coding experience..." : "Write a supportive reply..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={replyOf === '' ? 4 : 3}
                    className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-900 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/20 text-slate-100 placeholder-slate-600 focus:outline-none transition-all duration-300 font-medium font-sans leading-relaxed custom-scrollbar"
                />
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-outfit">
                {/* Custom File uploader */}
                <div className="flex items-center space-x-2">
                    <label 
                        htmlFor={`file-upload-${replyOf || 'new'}`}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 font-semibold py-2 px-5 rounded-2xl cursor-pointer shadow-sm transition duration-300 transform hover:-translate-y-0.5 text-center text-sm"
                    >
                        {file ? 'Change Image' : 'Add Image'}
                    </label>
                    <input 
                        type="file" 
                        id={`file-upload-${replyOf || 'new'}`} 
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        accept="image/*"
                    />
                    {file && (
                        <span className="text-xs text-slate-400 truncate max-w-[150px] font-sans">
                            {file.name}
                        </span>
                    )}
                </div>

                {/* Submit Action */}
                <button
                    onClick={handleTweetCreate}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-md hover:shadow-orange-500/25 transition duration-300 transform hover:-translate-y-0.5"
                >
                    {replyOf === '' ? 'Share Post' : 'Post Reply'}
                </button>
            </div>
        </div>
    );
}

export default Reply;
