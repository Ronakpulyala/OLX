'use client';

import { useState, useEffect } from 'react';
import Avatar from '@/components/ui/Avatar';
import { Send, Image as ImageIcon, Phone, MoreVertical, ShieldCheck, ArrowLeft, CheckCheck, Tag, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface ChatConversation {
  id: string;
  user: string;
  avatar: string;
  listingSlug: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  isAIVerified: boolean;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
}

interface MessageItem {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

const DEFAULT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    user: 'Aditya Narayanan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    listingSlug: 'iphone-13-pro-max-256gb',
    listingTitle: 'iPhone 13 Pro Max - 256GB Sierra Blue',
    listingPrice: 64999,
    listingImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&h=120&fit=crop',
    isAIVerified: true,
    lastMsg: 'Yes, bill and box are available. When can you meet?',
    time: '10:30 AM',
    unread: 2,
    online: true,
  },
  {
    id: 'conv-2',
    user: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    listingSlug: 'sony-playstation-5-disc',
    listingTitle: 'Sony PlayStation 5 Disc Edition + 2 Controllers',
    listingPrice: 41500,
    listingImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=120&h=120&fit=crop',
    isAIVerified: true,
    lastMsg: 'Price is slightly negotiable for cash pickup.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 'conv-3',
    user: 'Vikram Joshi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
    listingSlug: 'royal-enfield-classic-350',
    listingTitle: 'Royal Enfield Classic 350 Stealth Black BS6',
    listingPrice: 175000,
    listingImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=120&h=120&fit=crop',
    isAIVerified: true,
    lastMsg: 'You can test ride it near Koramangala 4th block.',
    time: 'Oct 8',
    unread: 0,
    online: true,
  },
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>(DEFAULT_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState<ChatConversation>(DEFAULT_CONVERSATIONS[0]!);
  const [messages, setMessages] = useState<MessageItem[]>([
    { id: 'm1', sender: 'them', text: 'Hi! Are you interested in the item?', time: '10:20 AM' },
    { id: 'm2', sender: 'me', text: 'Yes, is the price negotiable if I pick it up today?', time: '10:25 AM' },
    { id: 'm3', sender: 'them', text: 'Yes, bill and box are available. When can you meet?', time: '10:30 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Load any submitted offers from API to sync real discussions
  useEffect(() => {
    async function loadRealOffers() {
      try {
        const res = await fetch('/api/offers');
        const data = await res.json();
        if (data.success && data.offers && data.offers.length > 0) {
          // If there are real offers in DB, enrich conversation list
          const latestOffer = data.offers[data.offers.length - 1];
          const offerConv: ChatConversation = {
            id: `offer-${latestOffer.id}`,
            user: latestOffer.buyerName,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            listingSlug: 'iphone-13-pro-max-256gb',
            listingTitle: `Offer Inquired: ₹ ${latestOffer.offerPrice.toLocaleString()}`,
            listingPrice: latestOffer.offerPrice,
            listingImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&h=120&fit=crop',
            isAIVerified: true,
            lastMsg: latestOffer.message || `Offered ₹ ${latestOffer.offerPrice}`,
            time: 'Just now',
            unread: 1,
            online: true,
          };
          setConversations((prev) => [offerConv, ...prev.filter(c => c.id !== offerConv.id)]);
        }
      } catch (err) {}
    }
    loadRealOffers();
  }, []);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: timeStr,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, lastMsg: text, time: timeStr, unread: 0 } : c
      )
    );

    // Save message via API if available
    try {
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: activeChat.listingSlug,
          sender: 'me',
          senderName: 'You',
          text,
          time: timeStr,
        }),
      }).catch(() => {});
    } catch {}

    // Dynamic simulated seller reply
    setTimeout(() => {
      let reply = 'Sounds good! What time works best for you to inspect the item?';
      if (text.toLowerCase().includes('offer') || text.toLowerCase().includes('price')) {
        reply = `I can do ₹ ${(activeChat.listingPrice * 0.95).toFixed(0)} if you come to inspect it in person today.`;
      } else if (text.toLowerCase().includes('available')) {
        reply = 'Yes, still available! You are welcome to test it out before deciding.';
      }

      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1100);
  };

  return (
    <div className="bg-[#f7f8f8] min-h-[calc(100vh-64px)] py-4 sm:py-6">
      <div className="container mx-auto px-2 sm:px-4 max-w-6xl h-[calc(100vh-100px)]">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex h-full overflow-hidden">
          
          {/* ─── Left Sidebar: Conversations List ───────────────── */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col h-full bg-white shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-black text-base text-[#002f34] tracking-tight">INBOX MESSAGES</h2>
              <span className="text-[11px] font-bold text-gray-500 uppercase">{conversations.length} Active</span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
              {conversations.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => {
                    setActiveChat(chat);
                    setMobileView('chat');
                  }}
                  className={`p-3.5 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeChat?.id === chat.id ? 'bg-teal-50/60 border-l-4 border-l-[#002f34]' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar src={chat.avatar} size="md" />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-xs text-[#002f34] truncate">{chat.user}</h3>
                      <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-[11px] text-teal-800 font-bold truncate">{chat.listingTitle}</p>
                    <p className={`text-xs truncate mt-0.5 ${chat.unread ? 'text-[#002f34] font-bold' : 'text-gray-500'}`}>
                      {chat.lastMsg}
                    </p>
                  </div>

                  {chat.unread > 0 && (
                    <div className="w-4 h-4 bg-teal-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 self-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Main Chat Window ─────────────────────────── */}
          <div className={`flex-1 flex-col h-full bg-[#f7f8f8] ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Chat Top Header */}
            <div className="p-3.5 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1 text-gray-600 hover:text-[#002f34]"
                >
                  <ArrowLeft size={18} />
                </button>
                <Avatar src={activeChat.avatar} size="sm" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-[#002f34]">{activeChat.user}</h3>
                    {activeChat.isAIVerified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Sparkles size={9} /> Verified Seller
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>{activeChat.online ? 'Online now' : 'Active today'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <button 
                  onClick={() => alert(`Direct calling ${activeChat.user} is enabled for verified listings.`)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#002f34]" 
                  title="Audio Call"
                >
                  <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Listing Quick Card Bar */}
            <div className="p-2.5 px-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded overflow-hidden relative shrink-0 bg-gray-100 border border-gray-200">
                  <Image src={activeChat.listingImage} alt="item" fill className="object-cover" />
                </div>
                <div>
                  <Link 
                    href={`/listing/${activeChat.listingSlug}`}
                    className="font-bold text-xs text-[#002f34] hover:text-teal-700 truncate max-w-[220px] sm:max-w-md block"
                  >
                    {activeChat.listingTitle}
                  </Link>
                  <p className="font-extrabold text-xs text-teal-800">{formatPrice(activeChat.listingPrice)}</p>
                </div>
              </div>

              <button 
                onClick={() => handleSendMessage(`I would like to offer ₹ ${(activeChat.listingPrice * 0.9).toFixed(0)} for immediate pickup.`)}
                className="bg-white border-2 border-[#002f34] text-[#002f34] hover:bg-[#002f34] hover:text-white px-3 py-1 rounded text-xs font-bold transition-all shrink-0 flex items-center gap-1"
              >
                <Tag size={12} />
                <span>Make Offer</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {/* Safety notice */}
              <div className="flex justify-center my-2">
                <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                  <ShieldCheck size={14} className="text-amber-600" />
                  <span>Never transfer advance money. Always meet in person at a public location.</span>
                </span>
              </div>

              {/* Message bubbles */}
              {messages.map((m) => {
                const isMe = m.sender === 'me';
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-md p-3.5 rounded-xl shadow-sm text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-[#002f34] text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isMe ? 'text-teal-200' : 'text-gray-400'}`}>
                        <span>{m.time}</span>
                        {isMe && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                'Is this still available?',
                'What is your best price?',
                'Can I inspect it today?',
                'Does it have bill, box, and accessories?',
                'Can we meet in a public location?',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="whitespace-nowrap text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-[#002f34] px-3 py-1 rounded-full transition-colors shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <button 
                type="button"
                onClick={() => alert('Photo sharing is protected by Sell Anti-Fraud.')}
                className="p-2 text-gray-400 hover:text-[#002f34] transition-colors shrink-0"
                title="Send photo"
              >
                <ImageIcon size={20} />
              </button>

              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message here..." 
                className="flex-1 bg-gray-100 border border-transparent focus:border-[#002f34] focus:bg-white rounded-full px-4 py-2 text-xs outline-none text-[#002f34]"
              />

              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-[#002f34] hover:bg-[#001e21] text-white rounded-full transition-all disabled:opacity-40 shrink-0"
                title="Send message"
              >
                <Send size={16} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
