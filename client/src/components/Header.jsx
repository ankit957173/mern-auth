import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className='bg-slate-200'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold flex items-center justify-between'>TrustLink<lord-icon
                        src="https://cdn.lordicon.com/lomfljuq.json"
                        trigger="morph"
                        state="morph-check-out-1"
                        style={{ "width": "25px", "height": "25px" }}>
                    </lord-icon></h1>
                </Link>
                <ul className='flex gap-4'>
                    <Link to='/home' >
                        <li>Home</li>
                    </Link>
                    <Link to='/' >
                        <li>About</li>
                    </Link>
                    <Link to='/profile' >
                        {currentUser ? (
                            <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
                        ) : (
                            <li>Log In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </div>
    );
}