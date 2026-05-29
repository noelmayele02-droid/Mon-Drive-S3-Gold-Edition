<template>
  <div class="min-h-screen bg-[#08090c] text-[#e5e7eb] px-4 py-8 sm:p-8 md:p-12 relative flex items-center justify-center fade-in">
    <!-- Légère lueur dorée diffuse en arrière-plan -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#d4af37]/5 blur-[120px] pointer-events-none"></div>

    <div class="w-full max-w-4xl bg-[#111318]/60 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6 md:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]">
      
      <!-- HEADER PUR ET MINIMALISTE -->
      <header class="flex items-center justify-between border-b border-white/[0.05] pb-5 mb-8">
        <div class="flex items-center gap-3">
          <!-- Point lumineux or -->
          <div class="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.7)] animate-pulse"></div>
          <h1 class="text-sm font-bold tracking-[0.2em] text-white uppercase">
            Mon Drive S3 <span class="text-[#d4af37]">Gold Edition</span>
          </h1>
        </div>
        
        <!-- Indicateur de statut discret style smartphone -->
        <div :class="awsConfigured ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : 'text-[#d4af37]/80 bg-[#d4af37]/5 border-[#d4af37]/10'" class="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border">
          {{ awsConfigured ? 's3_ready' : 'config_required' }}
        </div>
      </header>

      <!-- GRILLE PRINCIPALE (STYLE TÉLÉPHONE SANS SUPERFLU) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- SECTION CONFIG & IMPORTS (GAUCHE) -->
        <div class="md:col-span-1 space-y-6">
          
          <!-- CREDENTIALS INPUTS RE-STYLES -->
          <div class="space-y-4">
            <h2 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Authentification</h2>
            <div class="space-y-2">
              <input type="text" v-model="awsAccessKey" placeholder="Access Key ID" class="gold-input" />
              <input type="password" v-model="awsSecretKey" placeholder="Secret Access Key" class="gold-input" />
              <div class="grid grid-cols-2 gap-2">
                <input type="text" v-model="awsRegion" placeholder="eu-west-3" class="gold-input text-center" />
                <input type="text" v-model="awsBucket" placeholder="Bucket Name" class="gold-input text-center" />
              </div>
              <button @click="saveConfig" class="w-full py-2.5 mt-1 bg-[#d4af37] hover:bg-[#f3e5ab] text-[#08090c] font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-[0.99]">
                Appliquer l'accès
              </button>
            </div>
          </div>

          <!-- APPORT DE DOCUMENT -->
          <div class="space-y-3 pt-4 border-t border-white/[0.03]">
            <h2 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Nouveau fichier</h2>
            <div class="relative border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#d4af37]/30 rounded-lg p-4 text-center transition-all duration-300 group cursor-pointer">
              <input type="file" @change="handleFileChange" :disabled="!awsConfigured" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
              <p class="text-xs font-medium text-white/50 group-hover:text-white truncate max-w-[160px] mx-auto transition-colors">
                {{ selectedFile ? selectedFile.name : 'Parcourir les fichiers...' }}
              </p>
            </div>
            <button @click="uploadFile" :disabled="!selectedFile || !awsConfigured" class="w-full py-2.5 bg-transparent hover:bg-white/5 text-white disabled:text-white/20 border border-white/10 disabled:border-transparent font-medium text-xs uppercase tracking-wider rounded-lg transition-all duration-300">
              Envoyer au cloud
            </button>
          </div>
        </div>

        <!-- LISTE DU STORAGE (DROITE) -->
        <div class="md:col-span-2 space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Fichiers indexés ({{ files.length }})</h2>
            <button @click="fetchFiles" :disabled="!awsConfigured" class="text-[11px] text-[#d4af37] hover:text-[#f3e5ab] disabled:opacity-20 flex items-center gap-1 transition-colors font-medium">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18"/></svg>
              Rafraîchir
            </button>
          </div>

          <!-- TABLEAU DESIGN MOBILE ÉPURÉ -->
          <div class="border border-white/[0.04] bg-[#14171f]/40 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="text-white/40 font-medium border-b border-white/[0.04] bg-white/[0.01]">
                    <th class="px-5 py-3.5 tracking-wider">Nom</th>
                    <th class="px-5 py-3.5 tracking-wider">Taille</th>
                    <th class="px-5 py-3.5 text-right tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/[0.03] text-white/80">
                  <tr v-for="file in files" :key="file.name" class="hover:bg-white/[0.01] transition-colors group">
                    <td class="px-5 py-3.5 font-medium text-white/90 group-hover:text-[#d4af37] truncate max-w-[200px] transition-colors">
                      {{ file.name }}
                    </td>
                    <td class="px-5 py-3.5 text-white/40 font-mono text-[11px]">{{ formatSize(file.size) }}</td>
                    <td class="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                      <!-- Actions fines style miroir -->
                      <button @click="downloadFile(file.name)" class="px-2.5 py-1 bg-white/[0.03] hover:bg-white/10 text-white font-medium rounded border border-white/5 transition-all text-[11px]">
                        Prendre
                      </button>
                      <button @click="deleteFile(file.name)" class="px-2.5 py-1 bg-rose-500/5 hover:bg-rose-500 text-rose-400 hover:text-white font-medium rounded border border-rose-500/10 transition-all text-[11px]">
                        Retirer
                      </button>
                    </td>
                  </tr>
                  
                  <tr v-if="files.length === 0">
                    <td colspan="3" class="px-5 py-14 text-center text-white/20 font-medium italic tracking-wide">
                      {{ awsConfigured ? 'Aucun fichier détecté.' : 'Connectez vos identifiants à gauche.' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const API_BASE = 'http://localhost:3000/api/files';

const awsAccessKey = ref(localStorage.getItem('aws_key') || '');
const awsSecretKey = ref(localStorage.getItem('aws_secret') || '');
const awsRegion = ref(localStorage.getItem('aws_region') || 'eu-west-3');
const awsBucket = ref(localStorage.getItem('aws_bucket') || '');

const files = ref([]);
const selectedFile = ref(null);

const awsConfigured = computed(() => {
  return awsAccessKey.value && awsSecretKey.value && awsBucket.value;
});

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-aws-key': awsAccessKey.value,
  'x-aws-secret': awsSecretKey.value,
  'x-aws-region': awsRegion.value,
  'x-aws-bucket': awsBucket.value
});

const saveConfig = () => {
  localStorage.setItem('aws_key', awsAccessKey.value);
  localStorage.setItem('aws_secret', awsSecretKey.value);
  localStorage.setItem('aws_region', awsRegion.value);
  localStorage.setItem('aws_bucket', awsBucket.value);
  if (awsConfigured.value) fetchFiles();
};

const fetchFiles = async () => {
  if (!awsConfigured.value) return;
  try {
    const res = await fetch(API_BASE, { headers: getHeaders() });
    if (res.ok) files.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadFile = async () => {
  if (!selectedFile.value || !awsConfigured.value) return;
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'x-aws-key': awsAccessKey.value,
        'x-aws-secret': awsSecretKey.value,
        'x-aws-region': awsRegion.value,
        'x-aws-bucket': awsBucket.value
      },
      body: formData
    });
    if (res.ok) {
      selectedFile.value = null;
      fetchFiles();
    }
  } catch (err) {
    console.error(err);
  }
};

const downloadFile = (filename) => {
  const url = `${API_BASE}/download/${encodeURIComponent(filename)}?key=${encodeURIComponent(awsAccessKey.value)}&secret=${encodeURIComponent(awsSecretKey.value)}&region=${encodeURIComponent(awsRegion.value)}&bucket=${encodeURIComponent(awsBucket.value)}`;
  window.open(url);
};

const deleteFile = async (filename) => {
  if (!confirm(`Supprimer ${filename} ?`)) return;
  try {
    await fetch(`${API_BASE}/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    fetchFiles();
  } catch (err) {
    console.error(err);
  }
};

const formatSize = (bytes) => {
  if (!bytes) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

onMounted(() => {
  if (awsConfigured.value) fetchFiles();
});
</script>

<style scoped>
/* INPUTS ÉPURÉS STYLE LUXE ET SMARTPHONE */
.gold-input {
  width: 100%;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px 14px;
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.gold-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}
.gold-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 0 14px rgba(212, 175, 55, 0.05);
}

.fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>