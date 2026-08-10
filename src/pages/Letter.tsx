import { motion } from 'framer-motion';

const letterParagraphs = [
  "Happy Birthday meri jaan 🎂💖",
  "Pata nahi kaise itna time nikal gaya, but har saal ke saath app aur bhi zyada special lagti ho mujhe 🥹. Aaj bhi wahi feeling hai jo pehli baar hui thi jab apne pehli baar Hi bola tha bas ab wo feeling aur deep ho gayi hai 🫂.",
  "Itni saari memories hain humari freshers wala dance, wo pehli baar hands hold karna, wo saari raat ki gossips, saara (makeout) jo humne har spot pe kiya sab kuch aaj yaad aa raha hai 😭💓.",
  "Distance kabhi humein rokega nahi, kyunki mera dil toh hamesha apke paas hi rehta hai, chahe hum kahin bhi ho 🌍💞.",
  "Aaj ke din bas ek hi wish hai tu hamesha aise hi hasti rahe, bakchodi krti rh, khush rahe, aur mujhe pata hai tu jo bhi karegi usme best hi karegi (career)💫 but all the very best for the future. \"You are the best. My girl.\" ye main bas likh nahi raha, feel bhi karta hoon 🥹.",
  "I love you forever ♥️❤️. Happy Birthday darling, jaldi milte hain 🫂💋",
  "Aur ek chij aur 🥺 ladai karke kuch ni hoga bus hum dur honge aur aise hum dono hi ni chahte toh 🥺 misunderstanding ko dur karna aur 😭 ladai na karna hi acha h.",
  "Kabhi mai kuch kr deta hu kabhi app kabhi kisi aur reason se but at the end hamare pass Sirf hum hai 💖",
  "Mere pass tu aur tere pass mai hamesha 🥰",
  "Ily ❤️"
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 1.5, // Delay between each paragraph
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: "easeOut" }
  }
};

export default function Letter() {
  return (
    <main id="page-letter" className="page-wrapper" style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 className="font-heading gradient-text" style={{ fontSize: '2.8rem', textAlign: 'center', marginBottom: '2.5rem' }}>
          For You 💌
        </h1>
        
        <div 
          className="glass-card" 
          style={{ 
            padding: '3rem 2rem', 
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(249,213,229,0.75))',
            boxShadow: '0 8px 32px rgba(209,75,126,0.1)'
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.4rem' 
            }}
          >
            {letterParagraphs.map((text, i) => (
              <motion.p 
                key={i} 
                variants={itemVariants}
                style={{ 
                  fontSize: '1.05rem', 
                  lineHeight: 1.7, 
                  color: '#5a3045',
                  fontWeight: 500
                }}
              >
                {text}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
