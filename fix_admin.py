import sys

with open('src/screens/Admin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix adminSections
old_sections = '''    { id: 'notifications', name: 'Notificações', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'backup', name: 'Backup & Dados', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'settings', name: 'Configurações', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },'''
new_sections = '''    { id: 'notifications', name: 'Notificações', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'settings', name: 'Configurações', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },'''
content = content.replace(old_sections, new_sections)

# 2. Extract backup section
backup_start = content.find('{adminTab === \'backup\' && (')
backup_end = content.find('        {/* POPUP DE BOAS VINDAS */}')
backup_content = content[backup_start:backup_end]

# 3. Replace the backup content with nothing
content = content[:backup_start] + content[backup_end:]

# 4. Insert the backup content and whatsapp settings into the settings section
settings_start = content.find('{adminTab === \'settings\' && (')
if settings_start == -1:
    print('Error: settings tab not found')
    sys.exit(1)

inner_backup_start = backup_content.find('<section')
inner_backup_end = backup_content.rfind('</section>') + 10
inner_backup = backup_content[inner_backup_start:inner_backup_end]

whatsapp_config = '''
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
                  onChange={e => setAppSettings({...appSettings, whatsapp: e.target.value.replace(/\D/g, '')})} 
                  className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" 
                />
                <p className="text-xs text-emerald-600/70 pl-1">Insira apenas números (DDD + Número). Este número será usado no botão "Saiba Mais" da área de Parceiros.</p>
              </div>
            </div>
'''

old_settings = '''        {/* CONFIGURAÇÕES E IDIOMA */}
        {adminTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10">'''

new_settings = old_settings + whatsapp_config + '\n\n' + inner_backup + '\n\n' + '''            <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10">'''

content = content.replace(old_settings, new_settings)

with open('src/screens/Admin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
