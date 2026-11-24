// The identity our data tools send to websites. It says plainly what we are: an automated research
// tool, not a browser. Never replace it with a browser user-agent or add headers that imitate a browser
// (PLAYBOOK §7c). If a site refuses this identity, record the gap; do not work around it.
module.exports = {
  UA: 'GAM-Research-data-tool/1.0 (internal equity research; automated, low request rate)',
};
