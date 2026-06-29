'use client';

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(e) => { if (!confirm('Delete this article?')) e.preventDefault(); }}
        style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontFamily: "'Montserrat',sans-serif", fontSize: '.85rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
      >
        Delete Article
      </button>
    </form>
  );
}
