package com.noprobit.vmmanager.webapp.storage;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class StorageManagementService {
    private final AtomicLong ids = new AtomicLong(2);
    private final List<Pool> pools = new ArrayList<>(List.of(new Pool(1, "default", "dir", "/var/lib/libvirt/images", true), new Pool(2, "archive", "dir", "/srv/vms", false)));
    private final List<Volume> volumes = new ArrayList<>(List.of(new Volume(1, "base.qcow2", "default", "qcow2", 20)));
    public synchronized View view() { return new View(List.copyOf(pools), List.copyOf(volumes), "/var/lib/libvirt/images"); }
    public synchronized View pool(String action, long id, String name, String type, String target) { if ("create".equals(action)) pools.add(new Pool(ids.incrementAndGet(), name, type, target, false)); else for(int i=0;i<pools.size();i++){Pool pool=pools.get(i);if(pool.id()==id){if("delete".equals(action))pools.remove(i);else pools.set(i,new Pool(pool.id(),pool.name(),pool.type(),pool.target(),"start".equals(action)));break;}} return view(); }
    public synchronized View volume(String name,String pool,String format,int size){volumes.add(new Volume(ids.incrementAndGet(),name,pool,format,size));return view();}
    public record Pool(long id,String name,String type,String target,boolean active){} public record Volume(long id,String name,String pool,String format,int sizeGb){} public record View(List<Pool> pools,List<Volume> volumes,String currentPath){}
}