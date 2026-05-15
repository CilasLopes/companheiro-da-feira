const fs = require('fs');

let content = fs.readFileSync('src/screens/Admin.tsx', 'utf-8');

// 1. Fix adminSections
const old_sections = `    { id: 'notifications', name: 'Notificações', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'backup', name: 'Backup & Dados', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'settings', name: 'Configurações', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },`;
const new_sections = `    { id: 'notifications', name: 'Notificações', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'settings', name: 'Configurações', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },`;
content = content.replace(old_sections, new_sections);

// 2. Extract backup section
const backup_start = content.indexOf("{adminTab === 'backup' && (");
const backup_end = content.indexOf("        {/* POPUP DE BOAS VINDAS */}");
const backup_content = content.substring(backup_start, backup_end);

// 3. Replace the backup content with nothing
content = content.substring(0, backup_start) + content.substring(backup_end);

// 4. Insert the backup content and whatsapp settings into the settings section
const settings_start = content.indexOf("{adminTab === 'settings' && (");
if (settings_start === -1) {
    console.error('Error: settings tab not found');
    process.exit(1);
}

const inner_backup_start = backup_content.indexOf('<section');
const inner_backup_end = backup_content.lastIndexOf('</section>') + 10;
const inner_backup = backup_content.substring(inner_backup_start, inner_backup_end);

const whatsapp_config = `
            {/* Opções Gerais */}
            <div className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <Settings size={20} />
                </div>
                <h4 className="font-bold text-emerald-700">
                  Opções Gerais
                </h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest pl-1">WhatsApp para Contato (Parceiros)</label>
                <input 
                  type="tel" 
                  placeholder="Ex: 11999999999" 
                  value={appSettings?.whatsapp || ''} 
                  onChange={e => setAppSettings({...appSettings, whatsapp: e.target.value.replace(/\\D/g, '')})} 
                  className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" 
                />
                <p className="text-xs text-emerald-600/70 pl-1">Insira apenas números (DDD + Número). Este número será usado no botão "Saiba Mais" da área de Parceiros.</p>
              </div>
            </div>
`;

const old_settings = `        {/* CONFIGURAÇÕES E IDIOMA */}
        {adminTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10">`;

const new_settings = old_settings + whatsapp_config + '\n\n' + inner_backup + '\n\n' + `            <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10">`;

content = content.replace(old_settings, new_settings);

fs.writeFileSync('src/screens/Admin.tsx', content, 'utf-8');

console.log('Success');
