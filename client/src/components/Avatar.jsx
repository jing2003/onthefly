const Avatar = ({ user, className = "" }) => {
  if (!user?.avatarurl) {
    return null;
  }

  return (
    <div className={`Avatar ${className}`.trim()}>
      <img
        className="user-img"
        src={user.avatarurl}
        alt={`${user.username || "User"}'s GitHub avatar`}
      />
    </div>
  );
};

export default Avatar;
